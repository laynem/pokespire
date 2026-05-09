import { useState, useEffect } from 'react';

const spriteCache = new Map<number, string>();
const backSpriteCache = new Map<number, string>();

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getPokemonSpriteUrl(pokemonId: number, shiny = false, back = false): string {
  if (shiny) return `${SPRITE_BASE}/shiny/${pokemonId}.png`;
  if (back) return `${SPRITE_BASE}/back/${pokemonId}.png`;
  return `${SPRITE_BASE}/${pokemonId}.png`;
}

export function usePokemonSprite(pokemonId: number | null, back = false) {
  const cache = back ? backSpriteCache : spriteCache;
  const cached = pokemonId !== null ? (cache.get(pokemonId) ?? null) : null;
  const [spriteUrl, setSpriteUrl] = useState<string | null>(cached);
  const [loading, setLoading] = useState(pokemonId !== null && cached === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pokemonId === null) return;
    if (cache.has(pokemonId)) {
      setSpriteUrl(cache.get(pokemonId)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const url = getPokemonSpriteUrl(pokemonId, false, back);
    const img = new Image();
    img.onload = () => {
      cache.set(pokemonId, url);
      setSpriteUrl(url);
      setLoading(false);
    };
    img.onerror = () => {
      // fall back to front sprite if back doesn't exist
      if (back) {
        const frontUrl = getPokemonSpriteUrl(pokemonId, false, false);
        setSpriteUrl(frontUrl);
      } else {
        setError(`Failed to load sprite for #${pokemonId}`);
      }
      setLoading(false);
    };
    img.src = url;
  }, [pokemonId, back]); // eslint-disable-line

  return { spriteUrl, loading, error };
}

interface PokeApiPokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
  };
}

const apiCache = new Map<number, PokeApiPokemon>();

export function usePokeApi(pokemonId: number | null) {
  const [data, setData] = useState<PokeApiPokemon | null>(
    pokemonId !== null ? (apiCache.get(pokemonId) ?? null) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pokemonId === null) return;
    if (apiCache.has(pokemonId)) {
      setData(apiCache.get(pokemonId)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<PokeApiPokemon>;
      })
      .then((json) => {
        apiCache.set(pokemonId, json);
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pokemonId]);

  return { data, loading, error };
}
