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
      context?.setUserMove({
        name: moveData.name,
        url: moveData.url,
        power: moveData.power,
      });
    }
  };
  const className = isUser ? "user move-button" : "opponent move-button";
  return (
    <div className="move">
      <button className={className} onClick={handleMoveClick}>
        <p>{`${moveData.name} (${moveData.power})`}</p>
      </button>
    </div>
  );
};
