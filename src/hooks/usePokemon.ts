import { useState, useEffect } from 'react';

const spriteCache = new Map<number, string>();

const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getPokemonSpriteUrl(pokemonId: number, shiny = false): string {
  return shiny
    ? `${SPRITE_BASE}/shiny/${pokemonId}.png`
    : `${SPRITE_BASE}/${pokemonId}.png`;
}

export function usePokemonSprite(pokemonId: number | null) {
  const cached = pokemonId !== null ? (spriteCache.get(pokemonId) ?? null) : null;
  const [spriteUrl, setSpriteUrl] = useState<string | null>(cached);
  const [loading, setLoading] = useState(pokemonId !== null && cached === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pokemonId === null) return;
    if (spriteCache.has(pokemonId)) {
      setSpriteUrl(spriteCache.get(pokemonId)!);
      return;
    }

    setLoading(true);
    setError(null);

    const url = getPokemonSpriteUrl(pokemonId);
    const img = new Image();
    img.onload = () => {
      spriteCache.set(pokemonId, url);
      setSpriteUrl(url);
      setLoading(false);
    };
    img.onerror = () => {
      setError(`Failed to load sprite for #${pokemonId}`);
      setLoading(false);
    };
    img.src = url;
  }, [pokemonId]);

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
