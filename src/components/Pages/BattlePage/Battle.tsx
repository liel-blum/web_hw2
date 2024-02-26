import React from "react";
import { Header } from "../../Header/Header";
import { AppContext } from "../../../App";
import { MoveData, PokemonData } from "../../Types";
import { fetchRandomPokemons } from "../../../utils/utils";
import { Game } from "../../Game/Game";
import { BattleResult } from "../../BattleResult/BattleResult";
import { Player } from "../../Player/Player";

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
      context.startLoading();
      const results = await fetchRandomPokemons();
      setOpponentPokemonData(results);
    } catch (error) {
      context.setErrorMessage("Error while fetching opponent pokemons: " + error);
    } finally {
      context.stopLoading();
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
    }
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
      fetchOpponentPokemons();
    }
    return () => {
    };
  }, [roundCounter]);
  return (
    <BattleContext.Provider value={initialContext}>
      <Header header="Battle" />
      <div className="battle-prompt">
        {roundCounter <= 3 && <h1>{`Round ${roundCounter}`}</h1>}
        {<Player isUser={true} selectedPokemonData={selectedUserPokemon} pokemonData={userPokemonData} onClick={handlePokemonClick}/>}
        {roundCounter <= 3 && (
          <div className="game">
            {userMove && opponentMove && selectedUserPokemon && selectedOpponentPokemon && (
                <Game
                  userMove={userMove}
                  opponentMove={opponentMove}
                  userPokemonData={selectedUserPokemon}
                  opponentPokemonData={selectedOpponentPokemon}
                />
              )}
          </div>
        )}
        { <BattleResult roundCounter={roundCounter} userScore={userScore} />}
        { <Player isUser={false} selectedPokemonData={selectedOpponentPokemon} pokemonData={opponentPokemonData} />}
      </div>
    </BattleContext.Provider>
  );
};
