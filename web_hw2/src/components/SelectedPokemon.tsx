import React from "react";
import { PokemonData } from "./Types";
import { PokemonImage } from "./PokemonStats/PokemonImage";
import { fetchRandomMoves, getRandomIndex } from "../utils/utils";
import { PokemonMove } from "./PokemonStats/PokemonMove";

interface SelectedPokemonProps {
  pokemonData: PokemonData;
  isUser: boolean;
}

const chooseRandomMove = (moves: string[]): string => {
  return moves[getRandomIndex(moves.length)];
}

export const SelectedPokemon: React.FC<SelectedPokemonProps> = ({ pokemonData, isUser }) => {
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
              {fetchRandomMoves(pokemonData.moves).map(
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
