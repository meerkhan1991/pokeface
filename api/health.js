/**
 * Vercel Serverless Function & Express Route Handler
 * Endpoint: GET /api/health
 * Diagnostics endpoint for Gemini REST API and PokéAPI health
 */

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  // Diagnostic Access Control: If HEALTH_CHECK_SECRET is configured, require authorization
  const expectedSecret = process.env.HEALTH_CHECK_SECRET;
  if (expectedSecret && expectedSecret.trim() !== '') {
    const providedKey =
      req.headers['x-health-key'] ||
      req.query?.key ||
      (req.headers.authorization && req.headers.authorization.replace(/^Bearer\s+/i, ''));

    if (providedKey !== expectedSecret) {
      return res.status(401).json({
        error: 'Unauthorized: Diagnostic access key required.'
      });
    }
  }

  const results = [];

  // ==========================================
  // 1. Gemini API Health Check
  // ==========================================
  const apiKey = process.env.GEMINI_API_KEY;
  const rawModel = process.env.GEMINI_MODEL;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    results.push({
      source: 'gemini',
      status: 'no key',
      http: null,
      ms: 0
    });
  } else if (!rawModel || rawModel.trim() === '') {
    results.push({
      source: 'gemini',
      status: 'empty',
      http: null,
      ms: 0
    });
  } else {
    const modelId = rawModel.replace(/^models\//, '').trim();
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:generateContent`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const startMs = Date.now();

    try {
      const resp = await fetch(geminiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
          'User-Agent': 'aistudio-build'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Reply with OK.' }] }]
        })
      });

      const elapsed = Date.now() - startMs;
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof textContent === 'string' && textContent.trim().length > 0) {
          results.push({
            source: 'gemini',
            status: 'ok',
            http: resp.status,
            ms: elapsed
          });
        } else {
          results.push({
            source: 'gemini',
            status: 'empty',
            http: resp.status,
            ms: elapsed
          });
        }
      } else {
        // Status determination
        const status = resp.status === 403 || resp.status === 401 ? 'refused' : 'empty';
        results.push({
          source: 'gemini',
          status,
          http: resp.status,
          ms: elapsed
        });
      }
    } catch (err) {
      clearTimeout(timeoutId);
      const elapsed = Date.now() - startMs;
      if (err.name === 'AbortError') {
        results.push({
          source: 'gemini',
          status: 'slow',
          http: 504,
          ms: elapsed
        });
      } else {
        results.push({
          source: 'gemini',
          status: 'refused',
          http: null,
          ms: elapsed
        });
      }
    }
  }

  // ==========================================
  // 2. PokéAPI Health Check (Pikachu ID 25)
  // ==========================================
  const pokeController = new AbortController();
  const pokeTimeoutId = setTimeout(() => pokeController.abort(), 5000);
  const pokeStartMs = Date.now();

  try {
    const pokeResp = await fetch('https://pokeapi.co/api/v2/pokemon/25', {
      method: 'GET',
      signal: pokeController.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PokeLook-App/1.0'
      }
    });

    const pokeElapsed = Date.now() - pokeStartMs;
    pokeTimeoutId && clearTimeout(pokeTimeoutId);

    if (pokeResp.ok) {
      const pokeData = await pokeResp.json();
      if (
        typeof pokeData.id === 'number' &&
        typeof pokeData.name === 'string' &&
        Array.isArray(pokeData.types) &&
        pokeData.types.length > 0
      ) {
        results.push({
          source: 'pokeapi',
          status: 'ok',
          http: pokeResp.status,
          ms: pokeElapsed
        });
      } else {
        results.push({
          source: 'pokeapi',
          status: 'empty',
          http: pokeResp.status,
          ms: pokeElapsed
        });
      }
    } else {
      results.push({
        source: 'pokeapi',
        status: pokeResp.status === 403 ? 'refused' : 'empty',
        http: pokeResp.status,
        ms: pokeElapsed
      });
    }
  } catch (err) {
    pokeTimeoutId && clearTimeout(pokeTimeoutId);
    const pokeElapsed = Date.now() - pokeStartMs;
    if (err.name === 'AbortError') {
      results.push({
        source: 'pokeapi',
        status: 'slow',
        http: 504,
        ms: pokeElapsed
      });
    } else {
      results.push({
        source: 'pokeapi',
        status: 'refused',
        http: null,
        ms: pokeElapsed
      });
    }
  }

  // Determine overall health status
  const allOk = results.length === 2 && results.every((s) => s.status === 'ok');
  const overall = allOk ? 'ok' : 'unhealthy';

  const statusCode = allOk ? 200 : 503;

  return res.status(statusCode).json({
    overall,
    sources: results
  });
}
