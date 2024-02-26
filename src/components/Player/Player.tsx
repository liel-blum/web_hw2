import React from "react";
import { PokemonData } from "../Types";
import { PokemonImage } from "../PokemonStats/PokemonImage";
import { SelectedPokemon } from "../SelectedPokemon/SelectedPokemon";

interface PlayerProps {
  isUser: boolean;
  selectedPokemonData: PokemonData | null;
  pokemonData: PokemonData[];
  onClick?: (pokemonData: PokemonData) => void;
}

export const Player: React.FC<PlayerProps> = ({ isUser, selectedPokemonData, pokemonData, onClick }) => {
    const className = isUser ? "user" : "opponent";
    const pokemonsClassName = `${className} pokemons`;
    const movesClassName = `${className} moves`;

    return (
    <div className={className}>
    {!selectedPokemonData && (
      <div className={pokemonsClassName}>
        {pokemonData.map((data, index) => (
          <PokemonImage
            key={index}
            name={data.name}
            spriteUrl={data.spriteUrl}
            showName={true}
            alreadyPlayed={data.alreadyPlayed}
            isUser={isUser}
            onClick={onClick ? () => onClick(data) : undefined}
          />
        ))}
      </div>
    )}
    <div className={movesClassName}>
      {selectedPokemonData && (
        <SelectedPokemon
          pokemonData={selectedPokemonData}
          isUser={isUser}
        />
      )}
    </div>
    </div>
    )
}