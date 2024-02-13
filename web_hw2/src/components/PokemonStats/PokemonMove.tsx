import React from "react";
import { MoveEntry } from "../Types";

interface MoveProps {
  moveEntry: MoveEntry;
  isUser: boolean;
}

const handleMoveClick = (isUser: boolean) => {
    if(isUser){

    }
  };

export const PokemonMove: React.FC<MoveProps> = ({ moveEntry, isUser }) => {
  const [movePower, setmovePower] = React.useState<Number>(0);

  const fetchMovePower = async (move: MoveEntry) => {
    try{
      const response = await fetch(move.url);
      if (!response.ok) {
          throw new Error(`Error in fetching move data for ${move.name}`);
      } else {
          const responseData = await response.json();
          setmovePower(responseData.power? responseData.power : 0);
      }
    }
    catch(error){
      console.error("Error fetching move power:", error);
      throw error;
    }
  }

  React.useEffect(() => {
    fetchMovePower(moveEntry);
    return () => {
      console.log("cleanup");
    };
  }, []);
  return (
    <div className="move">
      <div className="move-name">
        <p>{`${moveEntry.name} (${movePower})`}</p>
      </div>
    </div>
  );
};
