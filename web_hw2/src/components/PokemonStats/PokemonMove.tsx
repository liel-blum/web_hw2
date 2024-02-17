import React from "react";
import { MoveData } from "../Types";
import { BattleContext } from "../Pages/BattlePage/Battle";

interface MoveProps {
  moveData: MoveData;
  isUser: boolean;
}

export const PokemonMove: React.FC<MoveProps> = ({ moveData, isUser }) => {
  let context = React.useContext(BattleContext);

  const handleMoveClick = () => {
    if (isUser && !context?.userMove) {
      console.log(moveData.name);
      console.log("User move set");
      context?.setUserMove({
        name: moveData.name,
        url: moveData.url,
        power: moveData.power,
      });
      console.log(context);
    }
  };
  return (
    <div className="move">
      <button className="move-button" onClick={handleMoveClick}>
        <p>{`${moveData.name} (${moveData.power})`}</p>
      </button>
    </div>
  );
};
