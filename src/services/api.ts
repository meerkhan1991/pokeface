export interface PokemonMatchResult {
  bestMatch: {
    id: number;
    name: string;
    displayName: string;
    types: string[];
    palette: string[];
  };
  alternativeMatches: Array<{
    id: number;
    name: string;
    displayName: string;
    types: string[];
    palette: string[];
  }>;
  visualReasons: string[];
  explanation: string;
}

export interface PokemonApiData {
  id: number;
  name: string;
  displayName: string;
  types: string[];
  artworkUrl: string;
}

/**
 * Sends image data to /api/match for AI visual analysis.
 */
export async function matchPokemon(
  imageDataUrl: string,
  mimeType: string
): Promise<PokemonMatchResult> {
  const response = await fetch('/api/match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: imageDataUrl,
      mimeType
    })
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 503 && data?.error === 'key not configured') {
      throw new Error('API key not configured. Please configure GEMINI_API_KEY in the environment secrets.');
    }
    if (response.status === 413) {
      throw new Error(data?.error || 'Image is too large. Maximum file size is 5 MB.');
    }
    if (response.status === 400) {
      throw new Error(data?.error || 'Invalid image file. Only JPG, PNG, and WebP are allowed.');
    }
    if (response.status === 504) {
      throw new Error('Analysis request timed out. Please try again.');
    }
    throw new Error(data?.error || 'AI service unavailable. Please try again in a few moments.');
  }

  return data as PokemonMatchResult;
}

/**
 * Fetches verified Pokémon artwork, types, and Pokédex info from /api/pokemon.
 */
export async function fetchPokemonInfo(nameOrId: string | number): Promise<PokemonApiData> {
  const query = encodeURIComponent(String(nameOrId).toLowerCase());
  const response = await fetch(`/api/pokemon?name=${query}`);

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Pokémon data unavailable for "${nameOrId}".`);
  }

  return response.json();
}
