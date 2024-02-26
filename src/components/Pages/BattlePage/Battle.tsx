import React from "react";
import { Header } from "../../Header/Header";
import { AppContext } from "../../../App";
import { PokemonImage } from "../../PokemonStats/PokemonImage";
import { MoveData, PokemonData } from "../../Types";
import { fetchRandomPokemons } from "../../../utils/utils";
import { SelectedPokemon } from "../../SelectedPokemon";
import { Game } from "../../Game/Game";
import "./Battle.css";

export interface BattleContext {
  selectedUserPokemon: PokemonData | null;
  setSelectedUserPokemon: (pokemon: PokemonData | null) => void;
  selectedOpponentPokemon: PokemonData | null;
  setSelectedOpponentPokemon: (pokemon: PokemonData | null) => void;
  userMove: MoveData | null;
  setUserMove: (move: MoveData | null) => void;
  opponentMove: MoveData | null;
  setOpponentMove: (move: MoveData | null) => void;
  roundCounter: number;
  setRoundCounter: (round: number) => void;
  userScore: number;
  setUserScore: (score: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const BattleContext = React.createContext<BattleContext | null>(null);

export const Battle: React.FC = () => {
  const context = React.useContext(AppContext)!;
  const userPokemonData: PokemonData[] = context.pokemonData;

  const [opponentPokemonData, setOpponentPokemonData] = React.useState<
    PokemonData[]
  >([]);
  const [selectedUserPokemon, setSelectedUserPokemon] =
    React.useState<PokemonData | null>(null);
  const [selectedOpponentPokemon, setSelectedOpponentPokemon] =
    React.useState<PokemonData | null>(null);
  const [userMove, setUserMove] = React.useState<MoveData | null>(null);
  const [opponentMove, setOpponentMove] = React.useState<MoveData | null>(null);
  const [roundCounter, setRoundCounter] = React.useState<number>(1);
  const [userScore, setUserScore] = React.useState<number>(0);

  const handlePokemonClick = (pokemon: PokemonData) => {
    if (!pokemon.alreadyPlayed) {
      pokemon.alreadyPlayed = true;
      setSelectedUserPokemon(pokemon);
      const notPlayedPokemons = opponentPokemonData.filter(
        (pokemon) => !pokemon.alreadyPlayed
      );
      let selectedOpponenetPokemon =
        notPlayedPokemons[Math.floor(Math.random() * notPlayedPokemons.length)];
      selectedOpponenetPokemon.alreadyPlayed = true;
      setSelectedOpponentPokemon(selectedOpponenetPokemon);
    }
  };

  async function fetchOpponentPokemons() {
    try {
      context.setLoading(true);
      const results = await fetchRandomPokemons();
      setOpponentPokemonData(results);
    } catch (error) {
      console.log("Error fetching opponent pokemon data:", error);
    } finally {
      context.setLoading(false);
    }
  }

  let initialContext: BattleContext = {
    selectedUserPokemon: selectedUserPokemon,
    setSelectedUserPokemon: (pokemon: PokemonData | null) => {
      setSelectedUserPokemon(pokemon);
    },
    selectedOpponentPokemon: selectedOpponentPokemon,
    setSelectedOpponentPokemon: (pokemon: PokemonData | null) => {
      setSelectedOpponentPokemon(pokemon);
    },
    userMove: userMove,
    opponentMove: opponentMove,
    setUserMove: (userMove: MoveData | null) => {
      setUserMove(userMove);
    },
    setOpponentMove: (opMove: MoveData | null) => {
      setOpponentMove(opMove);
    },
    roundCounter: roundCounter,
    setRoundCounter: (round: number) => {
      setRoundCounter(round);
    },
    userScore: userScore,
    setUserScore: (score: number) => {
      setUserScore(score);
    },
    loading: context.loading,
    setLoading: (loading: boolean) => {
      context.setLoading(loading);
    },
  };

  async function handleBattleEnd() {
    setTimeout(() => {
      let UserData = context.userData;
      let userBattleResult = userScore >= 2 ? 1 : 0;
      let updatedUserData = {
        userWins: UserData.userWins + userBattleResult,
        userBattles: UserData.userBattles + 1,
      };
      context.setUserData(updatedUserData);
      localStorage.setItem("UserData", JSON.stringify(updatedUserData));
      localStorage.setItem("pokemonData", JSON.stringify(userPokemonData));
      context.setPage("My Pokemon");
    }, 3000);
  }

  React.useEffect(() => {
    if (roundCounter > 3) {
      handleBattleEnd();
    } else if (roundCounter == 1) {
      setUserScore(0);
      console.log("fetching opponent pokemons");
      fetchOpponentPokemons();
    }
    return () => {
      console.log("cleanup");
    };
  }, [roundCounter]);
  return (
    <BattleContext.Provider value={initialContext}>
      <Header header="Battle" />
      <div className="battle-prompt">
        {roundCounter <= 3 && <h1>{`Round ${roundCounter}`}</h1>}
        <div className="user">
          {!selectedUserPokemon && (
            <div className="user pokemons">
              {userPokemonData.map((data, index) => (
                <PokemonImage
                  key={index}
                  name={data.name}
                  spriteUrl={data.spriteUrl}
                  showName={true}
                  alreadyPlayed={data.alreadyPlayed}
                  isUser={true}
                  onClick={() => handlePokemonClick(data)}
                />
              ))}
            </div>
          )}
          <div className="user moves">
            {selectedUserPokemon && (
              <SelectedPokemon
                pokemonData={selectedUserPokemon}
                isUser={true}
              />
            )}
          </div>
        </div>
        {roundCounter <= 3 && (
          <div className="game">
            {userMove &&
              opponentMove &&
              selectedUserPokemon &&
              selectedOpponentPokemon && (
                <Game
                  userMove={userMove}
                  opponentMove={opponentMove}
                  userPokemonData={selectedUserPokemon}
                  opponentPokemonData={selectedOpponentPokemon}
                />
              )}
          </div>
        )}
        {roundCounter > 3 && (
          <div className="result">
            {userScore >= 2 && (
              <div className="play-prompt">
                <p className="win-prompt">You Won the Battle!</p>
              </div>
            )}
            {userScore < 2 && (
              <div className="play-prompt">
                <p className="loss-prompt">You Lost the Battle!</p>
              </div>
            )}
          </div>
        )}
        <div className="opponent">
          {!selectedOpponentPokemon && (
            <div className="opponent pokemons">
              {opponentPokemonData.map((data, index) => (
                <PokemonImage
                  key={index}
                  name={data.name}
                  spriteUrl={data.spriteUrl}
                  showName={true}
                  alreadyPlayed={data.alreadyPlayed}
                  isUser={false}
                />
              ))}
            </div>
          )}
          <div className="opponent moves">
            {selectedOpponentPokemon && (
              <SelectedPokemon
                pokemonData={selectedOpponentPokemon}
                isUser={false}
              />
            )}
          </div>
        </div>
      </div>
    </BattleContext.Provider>
  );
};
