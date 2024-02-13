import React from "react";
import { PokemonData } from "./Types";
import { PokemonImage } from "./PokemonStats/PokemonImage";
import { getRandomMoves, getRandomIndex } from "../utils/utils";
import { PokemonMove } from "./PokemonStats/PokemonMove";
import { BattleContext } from "./Pages/BattlePage/Battle";

interface SelectedPokemonProps {
  pokemonData: PokemonData;
  isUser: boolean;
}

const chooseRandomMove = (moves: string[]): string => {
  return moves[getRandomIndex(moves.length)];
}

export const SelectedPokemon: React.FC<SelectedPokemonProps> = ({ pokemonData, isUser }) => {
  let context = React.useContext(BattleContext);

  const randomMoves = getRandomMoves(pokemonData.moves)
  
  if (!isUser && context?.userMove) {
    context?.setOpponentMove(chooseRandomMove(randomMoves.map(move => move.name));
  }
  
  return (
    <div className="pokemon">
      <div className="pokemon-image">
        <PokemonImage
          name={pokemonData.name}
          spriteUrl={pokemonData.spriteUrl}
        />
      </div>
      <div className="pokemon-moves">
          <div>
            <h1>{pokemonData.name}</h1>
            <h2>Moves</h2>
            <ul>
              {randomMoves.map(
                (move, index) => (
                  <PokemonMove key={index} moveEntry={move} isUser={isUser} />
                )
              )}
            </ul>
          </div>
      </div>
    </div>
  );
};
