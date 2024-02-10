import React from 'react';
import { MoveEntry } from '../Types';

interface PokemonStatsProps {
    name: string;
    height: number;
    weight: number;
    type: string;
    moves: MoveEntry[];
    wins: number;
    losses: number;
}

export const PokemonStats: React.FC<PokemonStatsProps> = ({ name, height, weight, type, moves, wins, losses}) => {
    return (
        <div className="pokemon-stats" key={name}>
            <div className="stats-content">
                <h1>{name}</h1>
                <p>Height: {height}</p>
                <p>Weight: {weight}</p>
                <p>Type: {type}</p>
                <div className="moves">
                    <h2>Moves</h2>
                    <ul>
                        {moves.map((move, index) => (
                            <li key={index}>{move.name}</li>
                        ))}
                    </ul>
                    </div>
            </div>
            <div className="win-stats">
            <p>Wins: {wins}</p>
            <p>Losses: {losses}</p>
            </div>
        </div>
    );
};