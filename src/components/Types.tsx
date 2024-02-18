export interface MoveData {
  name: string;
  url: string;
  power: number | null;
}

export interface MoveElement {
  move: MoveData;
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
  moves: MoveData[];
  losses: number;
  wins: number;
  baseStats: BaseStats;
  alreadyPlayed: boolean;
}

export interface UserData{
  userWins: number;
  userBattles: number;
}
