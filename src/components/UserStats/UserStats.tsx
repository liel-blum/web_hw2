import React from "react";
import { AppContext } from "../../App";
import { UserData } from "../Types";


export const UserStats: React.FC = () => {
    let context = React.useContext(AppContext)!;
    let userData: UserData = context.userData;
  return (
    <div className="user-stats">
        {userData.userBattles === 0 ?
        <p> You haven't played yet</p>
        : <p>You won {userData.userWins} out of {userData.userBattles} battles</p>
        }
    </div>
  );
};
