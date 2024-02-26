import { MoveElement, PokemonData, TypeEntry } from "../components/Types";

const MAX_POKEMON_ID = 386;
const NUM_POKEMONS: number = 3;

export const getRandomIndex = (length: number) => {
  return Math.floor(Math.random() * length);
};

// Function to get 3 random pokemons
const getRandomIds = (maxId: number) => {
  const randomIds: number[] = [];
  while (randomIds.length < NUM_POKEMONS) {
    const index = getRandomIndex(maxId);
    if (!randomIds.includes(index)) {
      randomIds.push(index);
    }
  }
  return randomIds;
};

const fetchPokemonData = async (id: number, signal: AbortSignal): Promise<PokemonData> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { signal });
  if (!response.ok) {
    throw new Error(`Error in fetching data for ${id}`);
  } else {
    const responseData = await response.json();
    return {
      name: responseData.name,
      spriteUrl: responseData.sprites.other["dream_world"]["front_default"],
      height: responseData.height,
      weight: responseData.weight,
      type: responseData.types[0].type as TypeEntry, // Only considering the first type as the primary type
      moves: responseData.moves.map(
        (moveElement: MoveElement) => moveElement.move
      ),
      baseStats: {
        hp: responseData.stats[0].base_stat,
        attack: responseData.stats[1].base_stat,
        defense: responseData.stats[2].base_stat,
        specialAttack: responseData.stats[3].base_stat,
        specialDefense: responseData.stats[4].base_stat,
        speed: responseData.stats[5].base_stat,
      },
      losses: 0,
      wins: 0,
      alreadyPlayed: false,
    };
  }
};

export const fetchRandomPokemons = async (signal: AbortSignal): Promise<PokemonData[]> => {
    const ids = getRandomIds(MAX_POKEMON_ID);
    const promises = ids.map((id) => fetchPokemonData(id + 1, signal));
    const results = await Promise.all(promises);
    return results;
}