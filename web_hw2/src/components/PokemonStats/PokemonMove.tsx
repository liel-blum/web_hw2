import React from "react";
import { MoveEntry } from "../Types";
import { BattleContext } from "../Pages/BattlePage/Battle"

interface MoveProps {
  moveEntry: MoveEntry;
  isUser: boolean;
}

export const PokemonMove: React.FC<MoveProps> = ({ moveEntry, isUser }) => {
  let context = React.useContext(BattleContext);
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

  const handleMoveClick = (isUser: boolean) => {
    if (isUser){
      context?.setUserMove(moveEntry.name, movePower);
    } 
  };

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
