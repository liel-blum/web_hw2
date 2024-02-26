import React from "react";

interface BattleResultProps {
  roundCounter: number;
  userScore: number;
}

export const BattleResult: React.FC<BattleResultProps> = ({ roundCounter, userScore}) => {
  return (
    <>
      {roundCounter > 3 && (
        <div className="result">
          {userScore >= 2 && (
            <div className="play-prompt">
              <p className="win-prompt">You Won the Battle!</p>
            </div>
          )}
          {userScore < 2 && (
            <div className="play-prompt">
              <p className="loss-prompt">You Lost the Battle!</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
