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

export interface PokemonData {
  name: string;
  spriteUrl: string;
  height: number;
  weight: number;
  type: TypeEntry;
  moves: MoveEntry[];
  losses: number;
  wins: number;
  // hp: string;
  // attack: string;
  // specialAttack: string;
  // specialDefense: string;
  // speed: string;
}
