import React from "react";
import "./PokemonImage.css";

interface PokemonImageProps {
  name: string;
  spriteUrl: string;
  onClick?: () => void;
}

export const PokemonImage: React.FC<PokemonImageProps> = ({
  name,
  spriteUrl,
  onClick,
}) => {
  return (
    <div className="pokemon-image" onClick={onClick}>
      <img src={spriteUrl} alt={name} style={{ cursor: "pointer" }} />
    </div>
  );
};
