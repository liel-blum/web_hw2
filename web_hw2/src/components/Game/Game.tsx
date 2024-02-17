import React from "react";
import { MoveData, PokemonData } from "../Types";


interface GameProps {
    userMove: MoveData;
    opponentMove: MoveData;
    userPokemonData: PokemonData;
    opponentPokemonData: PokemonData;
}



export const Game: React.FC<GameProps> = ({ userMove, opponentMove, userPokemonData, opponentPokemonData }) => {

    const [userTypeFactor, setUserTypeFactor] = React.useState<number>(0);
    const [opponentTypeFactor, setOpponentTypeFactor] = React.useState<number>(0);

    const calculateTotalPower = (move: MoveData, pokemonData: PokemonData, defenseStat: number, isUser: boolean) => {
        let typeFactor = isUser? userTypeFactor : opponentTypeFactor;
        return (move.power + pokemonData.baseStats.attack)*(typeFactor) - defenseStat;
    }

    const fetchTypeFactor = async (pokemonData: PokemonData, isUser: boolean) => {
        try{
          const response = await fetch(pokemonData.type.url);
          if (!response.ok) {
              throw new Error(`Error in fetching type factor for ${pokemonData.type.name}`);
          } else {
              const responseData = await response.json();
              if (isUser) {
                setUserTypeFactor(responseData.power? responseData.power : 0);
              } else {
                setOpponentTypeFactor(responseData.power? responseData.power : 0);
              }
          }
        }
        catch(error){
          console.error("Error fetching move power:", error);
          throw error;
        }
    }

    React.useEffect(() => {
        fetchTypeFactor(userPokemonData, true);
        fetchTypeFactor(opponentPokemonData, false);
    return () => {
        console.log("cleanup");
    };
    }, []);

    let userTotalPower = calculateTotalPower(userMove, userPokemonData, opponentPokemonData.baseStats.defense, true);
    let opponentTotalPower = calculateTotalPower(opponentMove, opponentPokemonData, userPokemonData.baseStats.defense, false);

    if (userTotalPower > opponentTotalPower) {
        
    } else if (userTotalPower < opponentTotalPower) {

    } else {

    }

    return (
        <div className='playPrompt'>
            <p className='move-prompt'>{`${userMove.name}>>${userMove.power}`}</p>
            <p className='move-prompt'>'vs'</p>
            <p className='move-prompt'>{`${opponentMove.name}>>${opponentMove.power}`}</p>
        </div>
    )
}

