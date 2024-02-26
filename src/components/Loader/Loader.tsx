import React from "react";

import "./Loader.css";

export const Loader: React.FC = () => {
  return (
    <div className="loading-container">
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif"
        alt="Loading"
      />
      <p>Loading...</p>
    </div>
  );
};
