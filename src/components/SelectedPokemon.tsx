import React from "react";
import { PokemonData, MoveData } from "./Types";
import { PokemonImage } from "./PokemonStats/PokemonImage";
import { getRandomIndex } from "../utils/utils";
import { PokemonMove } from "./PokemonStats/PokemonMove";
import { BattleContext } from "./Pages/BattlePage/Battle";
import "./SelectedPokemon.css";

const NUM_MOVES: number = 4;

interface SelectedPokemonProps {
  pokemonData: PokemonData;
  isUser: boolean;
}

const chooseRandomMove = (moves: MoveData[]): MoveData => {
  return moves[getRandomIndex(moves.length)];
};

export const SelectedPokemon: React.FC<SelectedPokemonProps> = ({
  pokemonData,
  isUser,
}) => {
  let battleContext = React.useContext(BattleContext);
  const [movesData, setMovesData] = React.useState<MoveData[]>([]);
  const [randomMoves, setRandomMoves] = React.useState<MoveData[]>([]);

  const getRandomMoves = (moves: MoveData[]): MoveData[] => {
    const randomMoves: MoveData[] = [];
    while (
      randomMoves.length < NUM_MOVES &&
      randomMoves.length < moves.length
    ) {
      const index = getRandomIndex(moves.length);
      if (!randomMoves.includes(moves[index])) {
        randomMoves.push(moves[index]);
      }
    }
    return randomMoves;
  };

  const fetchMovePower = async (move: MoveData): Promise<number> => {
    try {
      const response = await fetch(move.url);
      if (!response.ok) {
        throw new Error(`Error in fetching move data for ${move.name}`);
      } else {
        const responseData = await response.json();
        console.log("finished fetchMovePower");
        return responseData.power ? responseData.power : 0;
      }
    } catch (error) {
      console.error("Error fetching move power:", error);
      return -1;
    }
  };

  const fetchMovesPower = async (moves: MoveData[]): Promise<void> => {
    const promises = moves.map(async (moveData: MoveData, index) => {
      let power = await fetchMovePower(moveData);
      moves[index].power = power;
    });
    await Promise.all(promises);
    setMovesData(moves);
  };
  React.useEffect(() => {
    if (!isUser && battleContext?.userMove) {
      console.log("setting opponent move")
      battleContext?.setOpponentMove(chooseRandomMove(randomMoves));
    } else if (!battleContext?.userMove) {
      const randomMoves = getRandomMoves(pokemonData.moves);
      setRandomMoves(randomMoves);
      fetchMovesPower(randomMoves);
    }
    return () => {
      console.log("cleanup");
    };
  }, [battleContext?.userMove]);
  return (
    <div className="selected-pokemon">
      <div className="selected-pokemon-image">
        <PokemonImage
          name={pokemonData.name}
          spriteUrl={pokemonData.spriteUrl}
          isUser={isUser} 
        />
      </div>
      <div className="selected-pokemon-moves">
        <div>
          <h1>{pokemonData.name}</h1>
          <h2>Moves</h2>
          <ul>
            <div className="moves-container">
            {movesData.map((move, index) => (
              <PokemonMove key={index} moveData={move} isUser={isUser} />
            ))}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};
