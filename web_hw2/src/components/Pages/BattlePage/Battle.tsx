import React from "react";
import { Header } from "../../Header/Header";
import { AppContext } from "../../../App";
import { PokemonImage } from "../../PokemonStats/PokemonImage";
import { PokemonData } from "../../Types";
import { fetchRandomPokemons, fetchRandomMoves } from "../../../utils/utils";

export const Battle: React.FC = () => {
  const context = React.useContext(AppContext)!;
  const userPokemonData: PokemonData[] = context.pokemonData;
  const allPokemonNames: string[] = context.allPokemonNames;

  const [opponentPokemonData, setOpponentPokemonData] = React.useState<
    PokemonData[]
  >([]);
  const [selectedUserPokemon, setSelectedUserPokemon] =
    React.useState<PokemonData | null>(null);
  const [selectedOpponentPokemon, setSelectedOpponentPokemon] =
    React.useState<PokemonData | null>(null);

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

  React.useEffect(() => {
    fetchOpponentPokemons(allPokemonNames);
    return () => {
      console.log("cleanup");
    };
  }, []);

  return (
    <>
      <Header header="Battle" />
      <div className="user">
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
        <div className="user moves">
          {selectedUserPokemon && (
            <div>
              <h1>{selectedUserPokemon.name}</h1>
              <h2>Moves</h2>
              <ul>
                {fetchRandomMoves(selectedUserPokemon.moves).map(
                  (move, index) => (
                    <li key={index}>{move.name}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="opponent">
        <div className="opponent pokemons">
          {opponentPokemonData.map((data, index) => (
            <PokemonImage
              key={index}
              name={data.name}
              spriteUrl={data.spriteUrl}
            />
          ))}
        </div>
        <div className="opponent moves">
          {selectedOpponentPokemon && (
            <div>
              <h1>{selectedOpponentPokemon.name}</h1>
              <h2>Moves</h2>
              <ul>
                {fetchRandomMoves(selectedOpponentPokemon.moves).map(
                  (move, index) => (
                    <li key={index}>{move.name}</li>
                  )
                )}
              </ul>
            </div>
          )}
      </div>
    </div>
    </>
  );
};
