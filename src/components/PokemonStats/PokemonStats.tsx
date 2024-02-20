import React from 'react';
import { PokemonData } from '../Types';
import './PokemonStats.css';

interface PokemonStatsProps {
    pokemonData: PokemonData;
}

export const PokemonStats: React.FC<PokemonStatsProps> = ({ pokemonData }) => {
    return (
        <div className="pokemon-stats" key={pokemonData.name}>
            <div className="stats">
                <div className="stats-content">
                    <h1>{pokemonData.name}</h1>
                    <p>Height: {pokemonData.height}</p>
                    <p>Weight: {pokemonData.weight}</p>
                    <p>Type: {pokemonData.type.name}</p>
                </div>
                <div className="base-stats">
                    <h1>Stats...</h1>
                    <p>HP: {pokemonData.baseStats.hp}</p>
                    <p>Attack: {pokemonData.baseStats.attack}</p>
                    <p>Defense: {pokemonData.baseStats.defense}</p>
                    <p>Special Attack: {pokemonData.baseStats.specialAttack}</p>
                    <p>Special Defense: {pokemonData.baseStats.specialDefense}</p>
                    <p>Speed: {pokemonData.baseStats.speed}</p>
                </div>
            </div>
            <div className="win-stats">
            <p>Wins: {pokemonData.wins}</p>
            <p>Losses: {pokemonData.losses}</p>
            </div>
        </div>
    );
};