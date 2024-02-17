import React from "react";TypeRelation[]
import { MoveData, PokemonData } from "../Types";

interface GameProps {
  userMove: MoveData;
  opponentMove: MoveData;
  userPokemonData: PokemonData;
  opponentPokemonData: PokemonData;
}

interface TypeRelation {
    name: string;
  }

interface DamageRelations {
    double_damage_from: TypeRelation[];
    double_damage_to: TypeRelation[];
    half_damage_from: TypeRelation[];
    half_damage_to: TypeRelation[];
    no_damage_from: TypeRelation[];
    no_damage_to: TypeRelation[];
  }


export const Game: React.FC<GameProps> = ({
  userMove,
  opponentMove,
  userPokemonData,
  opponentPokemonData,
}) => {
  const [userTypeFactor, setUserTypeFactor] = React.useState<number>(0);
  const [opponentTypeFactor, setOpponentTypeFactor] = React.useState<number>(0);

  const calculateTotalPower = (
    move: MoveData,
    pokemonData: PokemonData,
    defenseStat: number,
    isUser: boolean
  ) => {
    let typeFactor = isUser ? userTypeFactor : opponentTypeFactor;
    return (
      (move.power ? move.power : 0 + pokemonData.baseStats.attack) *
        typeFactor -
      defenseStat
    );
  };

  const caclulateTypeFactor = (userTypeData: JSON, opponentTypeName: string) => {
    let userTypeFactor = 1;
    let opponentTypeFactor = 1;

    if (
        userTypeData.damage_relations.double_damage_from.some(
        (type: string) => type.name === opponentTypeName
      )
    ) {
        opponentTypeFactor *= 2;
    }

    if (
      defendingTypeData.damage_relations.half_damage_from.some(
        (type) => type.name === attackingTypeData.name
      )
    ) {
        opponentTypeFactor *= 0.5;
    }
    if (
      defendingTypeData.damage_relations.no_damage_from.some(
        (type) => type.name === attackingTypeData.name
      )
    ) {
        opponentTypeFactor = 0;
    }
  };

  const fetchTypeFactor = async (pokemonData: PokemonData, opponentType:string) => {
    try {
      const response = await fetch(pokemonData.type.url);
      if (!response.ok) {
        throw new Error(
          `Error in fetching type factor for ${pokemonData.type.name}`
        );
      } else {
        const data = await response.json();
        const damageRelations: DamageRelations = {
            double_damage_from: data.damage_relations.double_damage_from.map((type: any) => ({ name: type.name })),
            double_damage_to: data.damage_relations.double_damage_to.map((type: any) => ({ name: type.name })),
            half_damage_from: data.damage_relations.half_damage_from.map((type: any) => ({ name: type.name })),
            half_damage_to: data.damage_relations.half_damage_to.map((type: any) => ({ name: type.name })),
            no_damage_from: data.damage_relations.no_damage_from.map((type: any) => ({ name: type.name })),
            no_damage_to: data.damage_relations.no_damage_to.map((type: any) => ({ name: type.name })),
          };
      }
    } catch (error) {
      console.error("Error fetching move power:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    fetchTypeFactor(userPokemonData, true, opponentPokemonData.type.name);
    return () => {
      console.log("cleanup");
    };
  }, []);

  let userTotalPower = calculateTotalPower(
    userMove,
    userPokemonData,
    opponentPokemonData.baseStats.defense,
    true
  );
  let opponentTotalPower = calculateTotalPower(
    opponentMove,
    opponentPokemonData,
    userPokemonData.baseStats.defense,
    false
  );

  if (userTotalPower > opponentTotalPower) {
  } else if (userTotalPower < opponentTotalPower) {
  } else {
  }

  return (
    <div className="playPrompt">
      <p className="move-prompt">{`${userMove.name} >> ${userMove.power}`}</p>
      <p className="move-prompt">vs</p>
      <p className="move-prompt">{`${opponentMove.name} >> ${opponentMove.power}`}</p>
    </div>
  );
};
