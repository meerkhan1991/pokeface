/**
 * Vercel Serverless Function & Express Route Handler
 * Endpoint: GET /api/pokemon?name=pikachu (or id)
 */

// 24-hour in-memory cache (key: lowercase name or id, value: { timestamp, data })
const cache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const queryParam = req.query?.name || req.query?.id;
  if (!queryParam || typeof queryParam !== 'string') {
    return res.status(400).json({ error: 'Parameter "name" or "id" is required.' });
  }

  const cleanIdentifier = queryParam.trim().toLowerCase();

  // Validate format (only alphanumeric and hyphens)
  if (!/^[a-z0-9-]+$/.test(cleanIdentifier)) {
    return res.status(400).json({ error: 'Invalid Pokémon name or ID format.' });
  }

  // Check 24-hour cache
  const cached = cache.get(cleanIdentifier);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).json(cached.data);
  }

  try {
    // 8-second timeout for PokéAPI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(cleanIdentifier)}`;
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PokeLook-App/1.0'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: `Pokémon "${cleanIdentifier}" not found in PokéAPI.` });
      }
      return res.status(502).json({ error: `PokéAPI error: HTTP ${response.status}` });
    }

    const rawData = await response.json();

    // Strict validation of returned fields
    if (typeof rawData.id !== 'number' || !rawData.name || !Array.isArray(rawData.types)) {
      return res.status(502).json({ error: 'Invalid response structure from PokéAPI.' });
    }

    const id = rawData.id;
    const name = rawData.name.toLowerCase();
    const displayName = rawData.name.charAt(0).toUpperCase() + rawData.name.slice(1);
    const types = rawData.types.map((t) => t?.type?.name).filter(Boolean);

    // Official artwork URL according to PokéAPI specification
    const officialArtwork =
      rawData.sprites?.other?.['official-artwork']?.front_default ||
      rawData.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    const validatedData = {
      id,
      name,
      displayName,
      types,
      artworkUrl: officialArtwork
    };

    // Cache under both name and ID
    cache.set(name, { timestamp: now, data: validatedData });
    cache.set(String(id), { timestamp: now, data: validatedData });

    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).json(validatedData);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'PokéAPI request timed out (exceeded 8 seconds).' });
    }
    return res.status(502).json({ error: 'Pokémon data unavailable from PokéAPI.' });
  }
}
