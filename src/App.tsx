import React from "react";
import "./App.css";
import { MyPokemon } from "./components/Pages/MyPokemonPage/MyPokemon";
import { Battle } from "./components/Pages/BattlePage/Battle";
import { PokemonData, UserData } from "./components/Types";
import { fetchRandomPokemons } from "./utils/utils";
import { Loader } from "./components/Loader/Loader";
import { ErrorState } from "./components/ErrorState/ErrorState";

interface AppContext {
  pokemonData: PokemonData[];
  setPokemonData: (data: PokemonData[]) => void;
  page: string;
  setPage: (page: string) => void;
  userData: UserData;
  setUserData: (UserData: UserData) => void;
  startLoading: () => void;
  stopLoading: () => void;
  errorMessage: string | undefined;
  setErrorMessage: (message: string) => void;
  onRetry: () => Promise<void>
}


export const AppContext = React.createContext<AppContext | null>(null);

export const App: React.FC = () => {
  let [pokemonData, setPokemonData] = React.useState<PokemonData[]>([]);
  let [page, setPage] = React.useState<string>("My Pokemon");
  let [userData, setUserData] = React.useState<UserData>({userWins: 0, userBattles: 0});
  let [Loading, setLoading] = React.useState<number>(0);
  let [errorMessage, setErrorMessage] = React.useState<string | undefined>("");

  const startLoading = () => setLoading((prev) => prev + 1);
  const stopLoading = () => setLoading((prev) => prev - 1);

  async function fetchUserPokemonData() {
    try {
      startLoading();
      const results = await fetchRandomPokemons();
      setPokemonData(results);
      localStorage.setItem("pokemonData", JSON.stringify(results));
    } catch (error) {
      setErrorMessage("Error while fetching pokemon data: " + error);
    }
    finally{
      stopLoading();
    }
  }

  const handleStartOver = async () => {
    console.log("start over");
    setPage("My Pokemon");
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
    startLoading: startLoading,
    stopLoading: stopLoading,
    errorMessage: errorMessage,
    setErrorMessage: setErrorMessage,
    onRetry: async () => {
      // if we had an error state, we will reset the state of the game like start over was clicked
      setErrorMessage("");
      await handleStartOver();
    }
  };

  React.useEffect(() => {
    initiatePokemonData();
    initUserData();
    return () => {
    };
  }, []);

  return (
    <AppContext.Provider value={initialContext}>
      {errorMessage && <ErrorState />}
      {!errorMessage && (
        <>
          {Loading > 0 &&  <Loader/>}
          {page === "My Pokemon" && <MyPokemon handleStartOver={handleStartOver} />}
          {page === "Battle" && <Battle />}
        </>
      )}
    </AppContext.Provider>
  );
};
export default App;
