import { roll2d6, roll3d6WithAdvantage } from "../utils/diceRoller";

export function useDiceRoller() {
  const rollDice = (label: string, target: number, isSkill?: boolean) => {
    void roll2d6(label, target, isSkill);
  };

  const rollWithAdvantage = (label: string, target: number, under = true) => {
    void roll3d6WithAdvantage(label, target, under);
  };

  return {
    rollDice,
    rollWithAdvantage,
  };
}
