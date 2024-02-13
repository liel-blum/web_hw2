import React from "react";
import { MoveData, PokemonData } from "../Types";


interface GameProps {
    userMove: MoveData;
    opponentMove: MoveData;
    userPokemonData: PokemonData;
    opponentPokemonData: PokemonData;
}

const calculateTotalPower = (move: MoveData, pokemonData: PokemonData, defenseStat: number) => {
    return (move.power + pokemonData.base_stats.attack)* - defenseStat;
}

export const Game: React.FC<GameProps> = ({ userMove, opponentMove, userPokemonData, opponentPokemonData }) => {

    const [userTypeFactor, setUserTypeFactor] = React.useState<number>(0);
    const [opponentTypeFactor, setOpponentTypeFactor] = React.useState<number>(0);

    const fetchTypeFactor = async (pokemonData: PokemonData) => {
        try{
          const response = await fetch(pokemonData.type.url);
          if (!response.ok) {
              throw new Error(`Error in fetching type factor for ${pokemonData.type.name}`);
          } else {
              const responseData = await response.json();
              setUserTypeFactor(responseData.power? responseData.power : 0);
          }
        }
        catch(error){
          console.error("Error fetching move power:", error);
          throw error;
        }
    }

    React.useEffect(() => {
        fetchTypeFactor(moveEntry);
    return () => {
        console.log("cleanup");
    };
    }, []);

    let userTotalPower = calculateTotalPower(userMove, userPokemonData, opponentPokemonData.base_stats.defense);
    let opponentTotalPower = calculateTotalPower(opponentMove, opponentPokemonData, userPokemonData.base_stats.defense);
    return (
        <div className='playPrompt'>
            <p className='move-prompt'>{`${userMove.name}>>${userMove.power}`}</p>
            <p className='move-prompt'>'vs'</p>
            <p className='move-prompt'>{`${opponentMove.name}>>${opponentMove.power}`}</p>
        </div>
    )
}

