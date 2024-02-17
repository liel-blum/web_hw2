import React from "react";
import "./App.css";
import { MyPokemon } from "./components/Pages/MyPokemonPage/MyPokemon";
import { Battle } from "./components/Pages/BattlePage/Battle";
import { PokemonData } from "./components/Types";
import { fetchRandomPokemons } from "./utils/utils";

interface PokemonName {
  name: string;
}

interface PokemonListResponse {
  results: PokemonName[];
}

interface AppContext {
  pokemonData: PokemonData[];
  setPokemonData: (data: PokemonData[]) => void;
  allPokemonNames: string[];
  page: string;
  setPage: (page: string) => void;
  }

export const AppContext = React.createContext<AppContext | null>(null);

export const App: React.FC = () => {
  let [pokemonNames, setPokemonNames] = React.useState<string[]>([]);
  let [pokemonData, setPokemonData] = React.useState<PokemonData[]>([]);
  let [page, setPage] = React.useState<string>("My Pokemon");

  const K = 386;
  async function fetchFirstKPokemonNames(): Promise<string[]> {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${K}`
      );
      const data: PokemonListResponse = await response.json();
      const allPokemonNames = data.results.map((pokemon) => pokemon.name);
      localStorage.setItem("allPokemonNames", JSON.stringify(allPokemonNames));
      setPokemonNames(allPokemonNames);
      localStorage.setItem("pokemonNames", JSON.stringify(allPokemonNames));
      return allPokemonNames;
    } catch (error) {
      console.error("Error fetching Pokémon names:", error);
      throw error;
    }
  }

  async function fetchUserPokemonData(allPokemonNames: string[]){
    try {
      const results = await fetchRandomPokemons(allPokemonNames);
      setPokemonData(results);
      localStorage.setItem("pokemonData", JSON.stringify(results));
    } catch (error) {
      console.log("Error fetching pokemon  data:", error);
    }
  }

  const handleStartOver = async () => {
    console.log("start over");
    localStorage.removeItem("pokemonData");
    await initiatePokemonData();
  }

  async function initiatePokemonData(){
    console.log("entering initiatePokemonData")
    let data = localStorage.getItem("pokemonNames");
    let allPokemonNames: string[] = [];
    if(data !== null){
      console.log("fetching pokemon names from local storage")
      setPokemonNames(JSON.parse(data));
      allPokemonNames = JSON.parse(data);
    }
    else{
      console.log("fetching pokemon names from api")
      allPokemonNames = await fetchFirstKPokemonNames();
    }
    data = localStorage.getItem("pokemonData");
    if(data !== null){
      console.log("fetching pokemon data from local storage")
      setPokemonData(JSON.parse(data));
    }
    else{
      console.log("fetching pokemon data from api")
      await fetchUserPokemonData(allPokemonNames);
    }
  }

  //initial context object that will be used by provider
  let initialContext: AppContext = {
    pokemonData: pokemonData,
    setPokemonData: (pokemonData: PokemonData[]) => {
      setPokemonData(pokemonData);
    },
    allPokemonNames: pokemonNames,
    page: "My Pokemon",
    setPage: (page: string) => {
      setPage(page);
    },
      };

  React.useEffect(() => {
    initiatePokemonData();
    return () => {
      console.log("cleanup");
    };
  }, []);

  return (
    <AppContext.Provider value={initialContext}>
      {page === "My Pokemon" && <MyPokemon handleStartOver={handleStartOver} />}
      {page === "Battle" && <Battle />}
    </AppContext.Provider>
  );
};
export default App;
