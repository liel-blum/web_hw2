import React from "react";
import "./MyPokemon.css";
import { Header } from "../../Header/Header";
import { PokemonStats } from "../../PokemonStats/PokemonStats";
import { PokemonImage } from "../../PokemonStats/PokemonImage";
import { AppContext } from "../../../App";
import { Button } from "../../Buttons/Button";
import { PokemonData } from "../../Types";

export const MyPokemon: React.FC = () => {
  const context = React.useContext(AppContext)!;
  const pokemonData = context.pokemonData;

  const [selectedPokemon, setSelectedPokemon] =
    React.useState<PokemonData | null>(null);

  const handlePokemonClick = (pokemon: PokemonData) => {
    // Toggle selection
    if (selectedPokemon && selectedPokemon.name === pokemon.name) {
      setSelectedPokemon(null);
    } else {
      setSelectedPokemon(pokemon);
    }
  };

  return (
    <>
      <Header header="My Pokemon" />
      <div className="button-container">
        <Button onClick={() => context.setPage("Battle")} text="Let's Battle" />
      </div>
      <div>
        {pokemonData.map((data, index) => (
          <PokemonImage
            key={index}
            name={data.name}
            spriteUrl={data.spriteUrl}
            onClick={() => handlePokemonClick(data)}
          />
        ))}
      </div>
      {selectedPokemon && (
        <PokemonStats
          name={selectedPokemon.name}
          height={selectedPokemon.height}
          weight={selectedPokemon.weight}
          type={selectedPokemon.type}
          moves={selectedPokemon.moves}
          wins={selectedPokemon.wins}
          losses={selectedPokemon.losses}
        />
      )}
    </>
  );
};
