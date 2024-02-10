import React from "react";
import "./App.css";
import { MyPokemon } from "./components/Pages/MyPokemonPage/MyPokemon";
import { Battle } from "./components/Pages/BattlePage/Battle";

interface Pokemon {
  name: string;
}

interface PokemonListResponse {
  results: Pokemon[];
}

export interface PokemonData {
  name: string;
  spriteUrl: string;
  height: number;
  weight: number;
  type: string;
  // hp: string;
  // attack: string;
  // specialAttack: string;
  // specialDefense: string;
  // speed: string;
}

interface AppContext {
  pokemonData: PokemonData[];
  setPokemonData: (data: PokemonData[]) => void;
  page: string;
  setPage: (page: string) => void;
}

export const AppContext = React.createContext<AppContext | null>(null);

export const App: React.FC = () => {
  let [pokemonNames, setPokemonNames] = React.useState<string[]>([]);
  let [pokemonData, setPokemonData] = React.useState<PokemonData[]>([]);
  let [page, setPage] = React.useState<string>("My Pokemon");

  const K = 386;
  async function fetchFirstKPokemonNames() {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${K}`
      );
      const data: PokemonListResponse = await response.json();
      const allPokemonNames = data.results.map((pokemon) => pokemon.name);
      setPokemonNames(allPokemonNames);
      const names = getRandomNames(allPokemonNames);
      try {
        const promises = names.map((name) => fetchPokemonData(name));
        const results = await Promise.all(promises);
        setPokemonData(results);
      } catch (error) {
        console.log("Error fetching pokemon  data:", error);
      }
    } catch (error) {
      console.error("Error fetching Pokémon names:", error);
      throw error;
    }
  }

  const getRandomIndex = (length: number) => {
    return Math.floor(Math.random() * length);
  };

  // Function to get 3 random pokemons
  const getRandomNames = (names: string[]) => {
    const randomStrings: string[] = [];
    while (randomStrings.length < 3) {
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
      };
    }
  };

  //initial context object that will be used by provider
  let initialContext: AppContext = {
    pokemonData: pokemonData,
    setPokemonData: (pokemonData: PokemonData[]) => {
      setPokemonData(pokemonData);
    },
    page: "My Pokemon",
    setPage: (page: string) => {
      setPage(page);
    },
  };

  React.useEffect(() => {
    fetchFirstKPokemonNames();
    return () => {
      console.log("cleanup");
    };
  }, []);

  return (
    <AppContext.Provider value={initialContext}>
      <div>
        Pokemon Names length
        {pokemonNames.length}
      </div>
      {page === "My Pokemon" && <MyPokemon />}
      {page === "Battle" && <Battle />}
    </AppContext.Provider>
  );
};
export default App;
