import { Roll } from '../types/dice';

export const diceTypeTotal = (dice: number[], diceType: number) =>
  dice.reduce((sum, cur) => {
    const num = (cur % diceType) + 1;
    return sum + num;
  }, 0);

export const rollTotal = (roll: Roll): number => {
  return Object.entries(roll.dice)
    .map(([key, val]) => {
      if (val.results.length > 0) {
        return diceTypeTotal(val.results, val.sides);
      } else {
        return 0;
      }
    })
    .reduce((sum, cur) => sum + cur, Number.parseInt(roll.modifier || '0', 10));
};
