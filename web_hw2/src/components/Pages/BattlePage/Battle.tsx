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

}

export const BattleContext = React.createContext<BattleContext | null>(null);

export const Battle: React.FC = () => {
  const context = React.useContext(AppContext)!;
  const userPokemonData: PokemonData[] = context.pokemonData;
  const allPokemonNames: string[] = context.allPokemonNames;

  const [opponentPokemonData, setOpponentPokemonData] = React.useState<PokemonData[]>([]);
  const [selectedUserPokemon, setSelectedUserPokemon] = React.useState<PokemonData | null>(null);
  const [selectedOpponentPokemon, setSelectedOpponentPokemon] = React.useState<PokemonData | null>(null);
  const [userMove, setUserMove] = React.useState<MoveData | null>(null);
  const [opponentMove, setOpponentMove] = React.useState<MoveData | null>(null);
  const [roundCounter, setRoundCounter] = React.useState<number>(1);

  const handlePokemonClick = (pokemon: PokemonData) => {
        if (!pokemon.alreadyPlayed) {
      pokemon.alreadyPlayed = true;
      setSelectedUserPokemon(pokemon);
            const notPlayedPokemons = opponentPokemonData.filter(pokemon => !pokemon.alreadyPlayed);
      let selectedOpponenetPokemon = notPlayedPokemons[Math.floor(Math.random() * notPlayedPokemons.length)];
      selectedOpponenetPokemon.alreadyPlayed = true;
      setSelectedOpponentPokemon(selectedOpponenetPokemon);
    }
  };

  async function fetchOpponentPokemons(allPokemonNames: string[]) {
    try {
      const results = await fetchRandomPokemons(allPokemonNames);
      setOpponentPokemonData(results);
    } catch (error) {
      console.log("Error fetching opponent pokemon data:", error);
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
      }
  };

  React.useEffect(() => {
    if (roundCounter > 3) {
      context.setPage("My Pokemon");
    }
    else if (roundCounter == 1){
      fetchOpponentPokemons(allPokemonNames);
    }
    return () => {
      console.log("cleanup");
    };
  }, [roundCounter]);
  return (
    <BattleContext.Provider value={initialContext}>
      <Header header="Battle" />
      <div className="battle-prompt">
        <h1>{roundCounter}</h1>
        <div className="user">
          {!selectedUserPokemon && 
            <div className="user pokemons">
              {userPokemonData.map((data, index) => (
                <PokemonImage
                  key={index}
                  name={data.name}
                  spriteUrl={data.spriteUrl}
                  showName={true}
                  onClick={() => handlePokemonClick(data)}
                />
              ))}
            </div>
          }
          <div className="user moves">
            {selectedUserPokemon &&
              <SelectedPokemon pokemonData={selectedUserPokemon} isUser={true} />
            }
          </div>
        </div>
        <div className="game" >
          {userMove && opponentMove && selectedUserPokemon && selectedOpponentPokemon &&
          <Game userMove={userMove} opponentMove={opponentMove} userPokemonData={selectedUserPokemon} opponentPokemonData={selectedOpponentPokemon} roundCounter={roundCounter} setRoundCounter={setRoundCounter}/>}
        </div>
        <div className="opponent">
          {!selectedOpponentPokemon && 
            <div className="opponent pokemons">
              {opponentPokemonData.map((data, index) => (
                <PokemonImage
                  key={index}
                  name={data.name}
                  spriteUrl={data.spriteUrl}
                  showName={true}
                />
              ))}
            </div>
          }
          <div className="opponent moves">
            {selectedOpponentPokemon &&
              <SelectedPokemon pokemonData={selectedOpponentPokemon} isUser={false} />
            }
          </div>
        </div>
      </div>
    </BattleContext.Provider>
  );
};
