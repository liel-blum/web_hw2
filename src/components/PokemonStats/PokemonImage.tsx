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

  let className = alreadyPlayed ? "pokemon-image already-played" : "pokemon-image";
  className += isUser ? " user" : " opponent";
  return (
    <div className="pokemon-div" >
      {showName && <p className="pokemon-name">{name}</p>}
      <div className={`${className}`} onClick={handleClick}>
        <img src={spriteUrl} alt={name} />
      </div>
    </div>
  );
};
