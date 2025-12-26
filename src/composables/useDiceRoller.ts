import { roll2d6 } from "../utils/diceRoller";

export function useDiceRoller() {
  const rollDice = (label: string, target: number, isSkill?: boolean) => {
    roll2d6(label, target, isSkill);
  };

  return {
    rollDice,
  };
}
