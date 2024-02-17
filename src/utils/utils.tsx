import { MoveElement, PokemonData, TypeEntry } from "../components/Types";

const NUM_POKEMONS: number = 3;

export const getRandomIndex = (length: number) => {
  return Math.floor(Math.random() * length);
};

// Function to get 3 random pokemons
const getRandomNames = (names: string[]) => {
  const randomStrings: string[] = [];
  while (randomStrings.length < NUM_POKEMONS) {
    const index = getRandomIndex(names.length);
    if (!randomStrings.includes(names[index])) {
      randomStrings.push(names[index]);
    }
  }
  return randomStrings;
};

const fetchPokemonData = async (name: string): Promise<PokemonData> => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) {
    throw new Error(`Error in fetching data for ${name}`);
  } else {
    const responseData = await response.json();
    return {
      name: responseData.name,
      spriteUrl: responseData.sprites.front_default,
      height: responseData.height,
      weight: responseData.weight,
      type: responseData.types[0].type as TypeEntry,
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

export const fetchRandomPokemons = async (allPokemonNames: string[]): Promise<PokemonData[]> => {
    const names = getRandomNames(allPokemonNames);
    const promises = names.map((name) => fetchPokemonData(name));
    const results = await Promise.all(promises);
    return results;
}