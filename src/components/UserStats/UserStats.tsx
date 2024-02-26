import React from "react";
import { AppContext } from "../../App";
import { UserData } from "../Types";


export const UserStats: React.FC = () => {
    let context = React.useContext(AppContext)!;
    let userData: UserData = context.userData;
    let percentage = (userData.userWins / userData.userBattles) * 100;
  return (
    <div className="user-stats">
        {userData.userBattles === 0 ?
        <p> You haven't played yet</p>
        : <div className="win-container"> <p>You won {userData.userWins} out of {userData.userBattles} battles</p>
        <p className="win-rate"> {Math.floor(percentage)}% </p>
        </div>
        }
    </div>
  );
};
