import React from "react";
import "./MyPokemon.css";
import { Header } from "../../Header/Header";
import { PokemonStats } from "../../PokemonStats/PokemonStats";
import { PokemonImage } from "../../PokemonStats/PokemonImage";
import { AppContext } from "../../../App";
import { Button } from "../../Buttons/Button";

import { PokemonData } from "../../Types";
import "../GlobalStyles.css";
import { UserStats } from "../../UserStats/UserStats";

interface MyPokemonProps {
  handleStartOver: () => Promise<void>;
}

export const MyPokemon: React.FC<MyPokemonProps> = ( {handleStartOver}) => {
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

  React.useEffect(() => {
    console.log("entered my pokemon useEffect");
    setSelectedPokemon(null);
    pokemonData.forEach((data) => {
      data.alreadyPlayed = false;
    });
    
  }, [pokemonData]); 
  return (
    <>
      <Header header="My Pokemon" />
      <div className="page">
        <div className="start-over-button">
            <Button onClick={handleStartOver} text="Start Over" />
        </div>
        <div className="pokemons">
            <div className="pokemon-left">
                <div className="pokemon-images">
                    {pokemonData.map((data, index) => (
                        <PokemonImage
                        key={index}
                        name={data.name}
                        spriteUrl={data.spriteUrl}
                        isUser={true} 
                        onClick={() => handlePokemonClick(data)}
                        />
                    ))}
                </div>
            </div>
            <div className="pokemons-right">
                <div className="pokemon-stats">
                {selectedPokemon && (
                    <PokemonStats
                    pokemonData={selectedPokemon}
                    />
                )}
                </div>
            </div>
        </div>
        <div className="battle-button">
          <Button
            onClick={() => context.setPage("Battle")}
            text="Let's Battle"
          />
        </div>
       < UserStats />
      </div>
    </>
  );
};
