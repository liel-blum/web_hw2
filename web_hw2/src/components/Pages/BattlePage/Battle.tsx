import React from "react";
import { Header } from "../../Header/Header";
import { AppContext } from "../../../App";
import { PokemonImage } from "../../PokemonStats/PokemonImage";
import { MoveData, PokemonData } from "../../Types";
import { fetchRandomPokemons, getRandomMoves } from "../../../utils/utils";
import { SelectedPokemon } from "../../SelectedPokemon";


export interface BattleContext {
    userMove: MoveData | null;
    opponentMove: MoveData | null;
    setUserMove: (move: MoveData) => void;
    setOpponentMove: (move: MoveData) => void;
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

  const handlePokemonClick = (pokemon: PokemonData) => {
    setSelectedUserPokemon(pokemon);
    setSelectedOpponentPokemon(
      opponentPokemonData[
        Math.floor(Math.random() * opponentPokemonData.length)
      ]
    );
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
    userMove: null,
    opponentMove: null,
    setUserMove: (userMove: MoveData) => {
      setUserMove(userMove);
    },
    setOpponentMove: (opMove: MoveData) => {
        setOpponentMove(opMove);
      },
  };

  React.useEffect(() => {
    fetchOpponentPokemons(allPokemonNames);
    return () => {
      console.log("cleanup");
    };
  }, []);

  return (
    <BattleContext.Provider value={initialContext}>
      <Header header="Battle" />
      <div className="user">
        {!selectedUserPokemon && 
          <div className="user pokemons">
            {userPokemonData.map((data, index) => (
              <PokemonImage
                key={index}
                name={data.name}
                spriteUrl={data.spriteUrl}
                onClick={() => handlePokemonClick(data)}
              />
            ))}
          </div>
        }
        <div className="user moves">
          {selectedUserPokemon &&
            SelectedPokemon({ pokemonData: selectedUserPokemon, isUser: true})}
        </div>
      </div>
      <div className="game" >
        {userMove && opponentMove &&
        <Game userMove={userMove} opponentMove={opponentMove} userData={userPokemonData}/>}
      </div>
      <div className="opponent">
        {!selectedOpponentPokemon && 
          <div className="opponent pokemons">
            {opponentPokemonData.map((data, index) => (
              <PokemonImage
                key={index}
                name={data.name}
                spriteUrl={data.spriteUrl}
              />
            ))}
          </div>
        }
        <div className="opponent moves">
          {selectedOpponentPokemon &&
            SelectedPokemon({ pokemonData: selectedOpponentPokemon, isUser: false})}
        </div>
      </div>
    </BattleContext.Provider>
  );
};
