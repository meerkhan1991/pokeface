/**
 * Vercel Serverless Function & Express Route Handler
 * Endpoint: POST /api/match
 * Uses Google Gemini REST API v1beta
 */
import { POKEMON_CATALOG, POKEMON_MAP, POKEMON_DISPLAY_MAP } from './pokemonCatalog.js';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BASE64_LENGTH = 5 * 1024 * 1024 * 1.4; // ~5MB file in base64

export default async function handler(req, res) {
  // Prevent any caching of photo analysis requests and responses
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({ error: 'key not configured' });
  }

  const rawModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const modelId = rawModel.replace(/^models\//, '').trim();

  try {
    const { image, mimeType } = req.body || {};

    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    // Strip data URL header if present
    let rawBase64 = image;
    let detectedMime = mimeType;

    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMime = match[1];
        rawBase64 = match[2];
      }
    }

    if (!detectedMime || !ALLOWED_MIME_TYPES.has(detectedMime.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid image format. Allowed formats are JPG, PNG, and WebP.'
      });
    }

    if (rawBase64.length > MAX_BASE64_LENGTH) {
      return res.status(413).json({
        error: 'Image too large. Maximum file size is 5 MB.'
      });
    }

    // Prepare list of allowed Pokémon names for the system instruction
    const allowedNames = POKEMON_CATALOG.map((p) => p.displayName);
    const catalogSummary = POKEMON_CATALOG.map(
      (p) => `${p.displayName} (Colors: ${p.palette.join(', ')} | Style: ${p.visualVibe})`
    ).join('\n');

    const systemInstruction = `You are PokéLook, an entertainment matching engine that pairs a photo with a fun Pokémon lookalike.
Analyze ONLY observable, non-sensitive styling cues:
- Facial expression (e.g., cheerful grin, peaceful closed-eye smile, comic bewildered look, confident smirk, calm gaze)
- Hairstyle/texture/silhouette (e.g., spiky, curly, sleek bob, pompadour, voluminous waves, braids)
- Clothing colours and dominant background tones (e.g., yellow, blue, orange, lavender, earthy tones, pink, dark navy)
- Observable accessories (e.g., glasses, caps, headbands, scarves, necklaces, bowties)
- Overall visual styling and aesthetic energy (e.g., sporty, cozy, vibrant, elegant, chill, playful)

CRITICAL ETHICAL RULES AND GUARDRAILS:
1. DO NOT identify the person in the photograph.
2. DO NOT use face recognition or compare with real people's identities.
3. DO NOT infer race, ethnicity, nationality, gender identity, age, health conditions, or personality traits.
4. DO NOT assess or rate attractiveness, beauty, body weight, or body shape.
5. DO NOT invent Pokémon names. You MUST select strictly from the 36 Pokémon provided in the allowlist.
6. Return output strictly in valid JSON format matching this schema:
{
  "bestMatch": "Pikachu",
  "alternativeMatches": ["Charmander", "Jolteon"],
  "visualReasons": ["Visual reason 1", "Visual reason 2", "Visual reason 3"],
  "explanation": "Brief 1-2 sentence playful explanation."
}

AVAILABLE POKÉMON ALLOWLIST (Choose ONLY from this list):
${catalogSummary}
`;

    const promptText = `Examine this photo's observable, non-sensitive styling cues (facial expression, hairstyle/hair volume, clothing/background colors, accessories, and overall styling).
Select:
1. The single best Pokémon match from the allowlist.
2. Two distinct alternative Pokémon matches from the allowlist.
3. Exactly three clear, playful visual reasons explaining the match.
4. A short, friendly 1-2 sentence explanation.

Valid Pokémon names to choose from:
${allowedNames.join(', ')}`;

    // 15-second request timeout for Gemini REST API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const callGeminiRest = async (modelToUse) => {
      const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelToUse)}:generateContent`;
      return fetch(restUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
          'User-Agent': 'aistudio-build'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: detectedMime.toLowerCase(),
                    data: rawBase64
                  }
                },
                {
                  text: promptText
                }
              ]
            }
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json'
          }
        })
      });
    };

    let geminiResponse;
    try {
      geminiResponse = await callGeminiRest(modelId);

      // If high demand spike (503), attempt a fast fallback retry with verified lite vision model
      if (geminiResponse.status === 503 && modelId !== 'gemini-3.1-flash-lite-preview') {
        geminiResponse = await callGeminiRest('gemini-3.1-flash-lite-preview');
      }
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({ error: 'AI analysis timed out (exceeded 15 seconds).' });
      }
      return res.status(502).json({ error: 'AI service unavailable. Please check your network connection.' });
    }

    clearTimeout(timeoutId);

    if (!geminiResponse.ok) {
      if (geminiResponse.status === 429) {
        return res.status(429).json({ error: 'AI rate limit exceeded. Please wait a moment and try again.' });
      }
      if (geminiResponse.status === 503) {
        return res.status(503).json({ error: 'AI service is currently experiencing high demand. Please try again shortly.' });
      }
      return res.status(502).json({ error: 'AI service returned an unexpected status code.' });
    }

    const responseJson = await geminiResponse.json();
    const candidateText = responseJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';

    let result;
    try {
      // Clean possible markdown code fences if present
      const cleanJsonStr = candidateText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      result = JSON.parse(cleanJsonStr);
    } catch {
      return res.status(502).json({ error: 'AI visual analysis produced an invalid response format.' });
    }

    // Helper to validate and look up against predefined catalog
    const resolvePokemon = (name) => {
      if (!name || typeof name !== 'string') return null;
      const clean = name.trim().toLowerCase();
      if (POKEMON_MAP.has(clean)) return POKEMON_MAP.get(clean);
      if (POKEMON_DISPLAY_MAP.has(clean)) return POKEMON_DISPLAY_MAP.get(clean);
      // Partial match fallback within allowlist
      for (const [key, p] of POKEMON_MAP) {
        if (clean.includes(key) || key.includes(clean)) return p;
      }
      return null;
    };

    let bestPokemon = resolvePokemon(result.bestMatch) || POKEMON_CATALOG[0]; // Pikachu fallback

    let alternatives = (result.alternativeMatches || [])
      .map(resolvePokemon)
      .filter((p) => p && p.id !== bestPokemon.id);

    // Ensure we have exactly 2 distinct alternatives from the allowlist
    if (alternatives.length < 2) {
      for (const p of POKEMON_CATALOG) {
        if (p.id !== bestPokemon.id && !alternatives.some((alt) => alt.id === p.id)) {
          alternatives.push(p);
          if (alternatives.length === 2) break;
        }
      }
    } else if (alternatives.length > 2) {
      alternatives = alternatives.slice(0, 2);
    }

    // Ensure we have 3 clear visual reasons
    let visualReasons = Array.isArray(result.visualReasons)
      ? result.visualReasons.filter((r) => typeof r === 'string' && r.trim().length > 0)
      : [];

    if (visualReasons.length < 3) {
      const fallbackReasons = bestPokemon.features || [
        'Complementary color palette and styling',
        'Distinctive expressive visual energy',
        'Harmonious overall visual aesthetic'
      ];
      while (visualReasons.length < 3) {
        visualReasons.push(fallbackReasons[visualReasons.length] || 'Playful visual styling match');
      }
    } else if (visualReasons.length > 3) {
      visualReasons = visualReasons.slice(0, 3);
    }

    const explanation =
      typeof result.explanation === 'string' && result.explanation.trim().length > 0
        ? result.explanation.trim()
        : `Your visual styling, expressive presence, and dominant color palette share a wonderful aesthetic vibe with ${bestPokemon.displayName}!`;

    return res.status(200).json({
      bestMatch: {
        id: bestPokemon.id,
        name: bestPokemon.name,
        displayName: bestPokemon.displayName,
        types: bestPokemon.types,
        palette: bestPokemon.palette
      },
      alternativeMatches: alternatives.map((p) => ({
        id: p.id,
        name: p.name,
        displayName: p.displayName,
        types: p.types,
        palette: p.palette
      })),
      visualReasons,
      explanation
    });
  } catch (error) {
    // Never leak image data or raw error traces with sensitive payloads
    return res.status(502).json({
      error: 'AI service unavailable. Please check your network or try again in a moment.'
    });
  }
}
