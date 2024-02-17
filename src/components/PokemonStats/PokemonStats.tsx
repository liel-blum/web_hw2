import React from 'react';

interface PokemonStatsProps {
    name: string;
    height: number;
    weight: number;
    type: string;
    wins: number;
    losses: number;
}

export const PokemonStats: React.FC<PokemonStatsProps> = ({ name, height, weight, type, wins, losses}) => {
    return (
        <div className="pokemon-stats" key={name}>
            <div className="stats-content">
                <h1>{name}</h1>
                <p>Height: {height}</p>
                <p>Weight: {weight}</p>
                <p>Type: {type}</p>
            </div>
            <div className="win-stats">
            <p>Wins: {wins}</p>
            <p>Losses: {losses}</p>
            </div>
        </div>
    );
};