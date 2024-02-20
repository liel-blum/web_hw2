import React from "react";
import "./PokemonImage.css";

interface PokemonImageProps {
  name: string;
  spriteUrl: string;
  showName?: boolean;
  alreadyPlayed?: boolean;
  isUser?: boolean;
  onClick?: () => void;
}

export const PokemonImage: React.FC<PokemonImageProps> = ({
  name,
  spriteUrl,
  showName,
  alreadyPlayed,
  isUser,
  onClick,
}) => {
  const handleClick = () => {
    if (isUser && !alreadyPlayed && onClick) {
      onClick();
    }
  };

  const cursorStyle = alreadyPlayed ? "default" : "pointer";
  const className = alreadyPlayed ? "already-played" : "";
  return (
    <div className="pokemon-div" >
      {showName && <p className="pokemon-name">{name}</p>}
      <div className={`pokemon-image ${className}`} onClick={handleClick}>
        <img src={spriteUrl} alt={name} style={{ cursor: cursorStyle }} />
      </div>
    </div>
  );
};
