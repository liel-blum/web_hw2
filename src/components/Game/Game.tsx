import React from "react";
import { MoveData, PokemonData } from "../Types";
import { BattleContext } from "../Pages/BattlePage/Battle";

const DELAY_WIN_TIME = 2500;
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
  let battleContext = React.useContext(BattleContext);
  const [userTypeFactor, setUserTypeFactor] = React.useState<number>(0);
  const [opponentTypeFactor, setOpponentTypeFactor] = React.useState<number>(0);
  const [isWinner, setIsWinner] = React.useState<boolean | null>(null);

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

  const caclulateTypeFactors = (
    userDamageRelations: DamageRelations,
    userTypeName: string,
    opponentTypeName: string
  ): { userTF: number; opponentTF: number } => {
    let userTF = 1;
    let opponentTF = 1;
    if (
      userDamageRelations.double_damage_to.some(
        (type) => type.name === opponentTypeName
      )
    ) {
      userTF = 2;
    } else if (
      userDamageRelations.half_damage_to.some(
        (type) => type.name === opponentTypeName
      )
    ) {
      userTF = 0.5;
    } else if (
      userDamageRelations.no_damage_to.some(
        (type) => type.name === opponentTypeName
      )
    ) {
      userTF = 0;
    }
    if (
      userDamageRelations.double_damage_from.some(
        (type) => type.name === userTypeName
      )
    ) {
      opponentTF = 2;
    } else if (
      userDamageRelations.half_damage_from.some(
        (type) => type.name === userTypeName
      )
    ) {
      opponentTF = 0.5;
    } else if (
      userDamageRelations.no_damage_from.some(
        (type) => type.name === userTypeName
      )
    ) {
      opponentTF = 0;
    }
    return { userTF, opponentTF };
  };

  const fetchTypeFactors = async (
    pokemonData: PokemonData,
    opponentType: string
  ) => {
    try {
      const response = await fetch(pokemonData.type.url);
      if (!response.ok) {
        throw new Error(
          `Error in fetching type factor for ${pokemonData.type.name}`
        );
      } else {
        const data = await response.json();
        const damageRelations: DamageRelations = {
          double_damage_from: data.damage_relations.double_damage_from.map(
            (type: TypeRelation) => ({ name: type.name })
          ),
          double_damage_to: data.damage_relations.double_damage_to.map(
            (type: TypeRelation) => ({ name: type.name })
          ),
          half_damage_from: data.damage_relations.half_damage_from.map(
            (type: TypeRelation) => ({ name: type.name })
          ),
          half_damage_to: data.damage_relations.half_damage_to.map(
            (type: TypeRelation) => ({ name: type.name })
          ),
          no_damage_from: data.damage_relations.no_damage_from.map(
            (type: TypeRelation) => ({ name: type.name })
          ),
          no_damage_to: data.damage_relations.no_damage_to.map(
            (type: TypeRelation) => ({ name: type.name })
          ),
        };
        const { userTF, opponentTF } = caclulateTypeFactors(
          damageRelations,
          pokemonData.type.name,
          opponentType
        );
        setUserTypeFactor(userTF);
        setOpponentTypeFactor(opponentTF);
      }
    } catch (error) {
      console.error("Error fetching move power:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    setIsWinner(null);
    fetchTypeFactors(userPokemonData, opponentPokemonData.type.name);
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
    setTimeout(() => {
      const userWins = userTotalPower >= opponentTotalPower;
      setIsWinner(userWins);
      if (userWins) {
        console.log("userPokemonData wins:", userPokemonData.wins);
        userPokemonData.wins++;
        opponentPokemonData.losses++;
        battleContext?.setUserScore(battleContext?.userScore + 1);
      } else {
        userPokemonData.losses++;
        opponentPokemonData.wins++;
      }
      setTimeout(() => {
        battleContext?.setSelectedUserPokemon(null);
        battleContext?.setSelectedOpponentPokemon(null);
        battleContext?.setUserMove(null);
        battleContext?.setOpponentMove(null);
        battleContext?.setRoundCounter(battleContext?.roundCounter + 1);
      }, DELAY_WIN_TIME);
    }, DELAY_WIN_TIME);
    return () => {
      console.log("cleanup");
    };
  }, []);
  return (
    <>
      {isWinner === null && (
        <div className="playPrompt">
          <p className="move-prompt">{`${userMove.name} >> ${userMove.power}`}</p>
          <p className="move-prompt">vs</p>
          <p className="move-prompt">{`${opponentMove.name} >> ${opponentMove.power}`}</p>
        </div>
      )}
      {isWinner && (
        <div className="playPrompt">
          <p className="win-prompt">Your Pokemon Won!</p>
        </div>
      )}
      {isWinner === false && (
        <div className="playPrompt">
          <p className="loss-prompt">Your Pokemon Lost!</p>
        </div>
      )}
    </>
  );
};
