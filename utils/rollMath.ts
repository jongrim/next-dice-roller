import { DiceState } from '../types/dice';

export const diceTypeTotal = (dice: number[], diceType: string) =>
  dice.reduce((sum, cur) => {
    const num = (cur % parseInt(diceType, 10)) + 1;
    return sum + num;
  }, 0);

export const rollTotal = (roll: DiceState): number => {
  return Object.entries(roll.dice)
    .map(([key, val]) => {
      if (val.dice.length > 0) {
        return diceTypeTotal(val.dice, key.substr(1, 1));
      } else {
        return 0;
      }
    })
    .reduce((sum, cur) => sum + cur, Number.parseInt(roll.modifier, 10));
};
