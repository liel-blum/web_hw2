import React from "react";
import "./PokemonImage.css";

interface PokemonImageProps {
  name: string;
  spriteUrl: string;
  showName?: boolean;
  onClick?: () => void;
}

export const PokemonImage: React.FC<PokemonImageProps> = ({
  name,
  spriteUrl,
  showName,
  onClick,
}) => {
  return (
    <div className="pokemon-div">
      {showName && <p className="pokemon-name">{name}</p>}
      <div className="pokemon-image" onClick={onClick}>
        <img src={spriteUrl} alt={name} style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
};
