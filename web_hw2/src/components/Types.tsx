export interface MoveEntry {
  name: string;
  url: string;
}

export interface MoveElement {
  move: MoveEntry;
}
export interface MoveData {
  name: string;
  power: number;
}

export interface TypeEntry {
    name: string;
    url: string;
  }

export interface BaseStats {
  hp: number;
  attack: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  defense: number;
  //do we need other stats that are not defense and attack?
}

export interface PokemonData {
  name: string;
  spriteUrl: string;
  height: number;
  weight: number;
  type: TypeEntry;
  moves: MoveEntry[];
  losses: number;
  wins: number;
  baseStats: BaseStats;
  alreadyPlayed: boolean;
}
