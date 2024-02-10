import { MoveElement, MoveEntry, PokemonData } from "../components/Types";

const NUM_POKEMONS: number = 3;
const NUM_MOVES: number = 4;

const getRandomIndex = (length: number) => {
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
      type: responseData.types[0].type.name,
      moves: responseData.moves.map(
        (moveElement: MoveElement) => moveElement.move
      ),
      losses: 0,
      wins: 0,
    };
  }
};

export const fetchRandomPokemons = async (allPokemonNames: string[]): Promise<PokemonData[]> => {
    const names = getRandomNames(allPokemonNames);
    const promises = names.map((name) => fetchPokemonData(name));
    const results = await Promise.all(promises);
    return results;
}

export const fetchRandomMoves = (moves: MoveEntry[]): MoveEntry[] => {
    const randomMoves: MoveEntry[] = [];
    while (randomMoves.length < NUM_MOVES && randomMoves.length < moves.length) {
        const index = getRandomIndex(moves.length);
        if (!randomMoves.includes(moves[index])) {
            randomMoves.push(moves[index]);
        }
    }
    return randomMoves;
}