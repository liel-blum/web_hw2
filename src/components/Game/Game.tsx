import React from "react";
import { MoveData, PokemonData } from "../Types";
import { BattleContext } from "../Pages/BattlePage/Battle";
import { AppContext } from "../../App";

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
  let appContext = React.useContext(AppContext);

  const [userTypeFactor, setUserTypeFactor] = React.useState<number>(0);
  const [opponentTypeFactor, setOpponentTypeFactor] = React.useState<number>(0);
  const [isWinner, setIsWinner] = React.useState<boolean | null>(null);
  const [userTotalPower, setUserTotalPower] = React.useState<number>(0);
  const [opponentTotalPower, setOpponentTotalPower] = React.useState<number>(0);

  const calculateTotalPower = (
    move: MoveData,
    pokemonData: PokemonData,
    defenseStat: number,
    isUser: boolean
  ) => {
    let typeFactor = isUser ? userTypeFactor : opponentTypeFactor;
    let movePower = move.power ? move.power : 0;
    return (
      (movePower + pokemonData.baseStats.attack) * typeFactor - defenseStat
    );
  };

  const calculateTypeFactors = (
    userDamageRelations: DamageRelations,
    opponentTypeName: string
  ): void => {
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
        (type) => type.name === opponentTypeName
      )
    ) {
      opponentTF = 2;
    } else if (
      userDamageRelations.half_damage_from.some(
        (type) => type.name === opponentTypeName
      )
    ) {
      opponentTF = 0.5;
    } else if (
      userDamageRelations.no_damage_from.some(
        (type) => type.name === opponentTypeName
      )
    ) {
      opponentTF = 0;
    }
    setUserTypeFactor(userTF);
    setOpponentTypeFactor(opponentTF);
  };

  const fetchTypeFactors = async (
    pokemonData: PokemonData,
    opponentType: string,
  ) => {
    try {
      appContext?.startLoading();
      const response = await fetch(pokemonData.type.url );
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
        calculateTypeFactors(
          damageRelations,
          opponentType
        );
      }
    } catch (error) {
      appContext?.setErrorMessage("Error while fetching type factor " + error);
    } finally {
      appContext?.stopLoading();
    }
  };

  React.useEffect(() => {
    if (userTypeFactor === 0 && opponentTypeFactor === 0) {
      setIsWinner(null);
      fetchTypeFactors(userPokemonData, opponentPokemonData.type.name);
    } else if (userTypeFactor !== 0 && opponentTypeFactor !== 0) {
      let userTotalPower = calculateTotalPower(
        userMove,
        userPokemonData,
        opponentPokemonData.baseStats.defense,
        true
      );
      setUserTotalPower(userTotalPower);
      let opponentTotalPower = calculateTotalPower(
        opponentMove,
        opponentPokemonData,
        userPokemonData.baseStats.defense,
        false
      );
      setOpponentTotalPower(opponentTotalPower);
      setTimeout(() => {
        const userWins = userTotalPower >= opponentTotalPower;
        setIsWinner(userWins);
        if (userWins) {
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
    }
    return () => {
    };
  }, [userTypeFactor, opponentTypeFactor]);
  return (
    <>
      {isWinner === null && (
        <div className="play-prompt">
          <p className="move-prompt">{`${userMove.name} >> ${userTotalPower}`}</p>
          <p className="move-prompt">vs</p>
          <p className="move-prompt">{`${opponentMove.name} >> ${opponentTotalPower}`}</p>
        </div>
      )}
      {isWinner && (
        <div className="play-prompt">
          <h2 className="win-prompt">Your Pokemon Won!</h2>
        </div>
      )}
      {isWinner === false && (
        <div className="play-prompt">
          <h2 className="loss-prompt">Your Pokemon Lost!</h2>
        </div>
      )}
    </>
  );
};
