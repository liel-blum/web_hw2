import React from "react";
import "./App.css";
import { MyPokemon } from "./components/Pages/MyPokemonPage/MyPokemon";
import { Battle } from "./components/Pages/BattlePage/Battle";
import { PokemonData, UserData } from "./components/Types";
import { fetchRandomPokemons } from "./utils/utils";
import { Loader } from "./components/Loader/Loader";

interface AppContext {
  pokemonData: PokemonData[];
  setPokemonData: (data: PokemonData[]) => void;
  page: string;
  setPage: (page: string) => void;
  userData: UserData;
  setUserData: (UserData: UserData) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}


export const AppContext = React.createContext<AppContext | null>(null);

export const App: React.FC = () => {
  let [pokemonData, setPokemonData] = React.useState<PokemonData[]>([]);
  let [page, setPage] = React.useState<string>("My Pokemon");
  let [userData, setUserData] = React.useState<UserData>({userWins: 0, userBattles: 0});
  let [Loading, setLoading] = React.useState<boolean>(false);

  async function fetchUserPokemonData(){
    try {
      setLoading(true);
      const results = await fetchRandomPokemons();
      setPokemonData(results);
      localStorage.setItem("pokemonData", JSON.stringify(results));
    } catch (error) {
      console.log("Error fetching pokemon  data:", error);
    }
    finally{
      setLoading(false);
    }
  }

  const handleStartOver = async () => {
    console.log("start over");
    localStorage.removeItem("pokemonData");
    localStorage.removeItem("UserData");
    await initiatePokemonData();
    initUserData();
  }

  async function initiatePokemonData(){
    const data = localStorage.getItem("pokemonData");
    if(data !== null){
      console.log("fetching pokemon data from local storage")
      setPokemonData(JSON.parse(data));
    } else {
      console.log("fetching pokemon data from api")
      await fetchUserPokemonData();
    }
  }

  function initUserData(){
    let data = localStorage.getItem("UserData");
    if(data === null){
      let userData = {userWins: 0, userBattles: 0};
      localStorage.setItem("UserData", JSON.stringify(userData));
      setUserData(userData);
    }
    else{
      setUserData(JSON.parse(data));
    }
  }

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
    userData: userData,
    setUserData: (userData: UserData) => {
      setUserData(userData);
    },
    loading: Loading,
    setLoading: (loading: boolean) => {
      setLoading(loading);
    }
  };

  React.useEffect(() => {
    initiatePokemonData();
    initUserData();
    return () => {
      console.log("cleanup");
    };
  }, []);

  return (
    <AppContext.Provider value={initialContext}>
      {Loading &&  <Loader/>}
      {page === "My Pokemon" && <MyPokemon handleStartOver={handleStartOver} />}
      {page === "Battle" && <Battle />}
    </AppContext.Provider>
  );
};
export default App;
