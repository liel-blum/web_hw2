export interface MoveEntry {
  name: string;
  url: string;
}

export interface MoveElement {
  move: MoveEntry;
}

export interface PokemonData {
  name: string;
  spriteUrl: string;
  height: number;
  weight: number;
  type: string;
  moves: MoveEntry[];
  losses: number;
  wins: number;
  // hp: string;
  // attack: string;
  // specialAttack: string;
  // specialDefense: string;
  // speed: string;
}
