import React from "react";
import './ErrorState.css';
import { AppContext } from "../../App";
import { Button } from "../Buttons/Button";

export const ErrorState: React.FC = () =>{
  const context = React.useContext(AppContext)!;
  console.log("showing error state");
  return(
    <div className="error-state-container">
      <div className="error-header">
        <h4 className="error-title">Pokeball error!</h4>
      </div>
        <p className="error-message">
          There was an error while fetching data: {context?.errorMessage}.
        </p>
        <Button onClick={context.onRetry} text="restart" />
    </div>
  )
};