import { rollTotal } from './rollMath';
import { DiceState } from '../types/dice';

test('rollTotal adds up the roll total', () => {
  const roll: DiceState = {
    dice: {
      d6: {
        dice: [8, 2, 43],
        needs: 3,
      },
      d8: {
        dice: [],
        needs: 0,
      },
      d10: {
        dice: [],
        needs: 0,
      },
      d12: {
        dice: [],
        needs: 0,
      },
      d20: {
        dice: [],
        needs: 0,
      },
      d100: {
        dice: [],
        needs: 0,
      },
    },
    modifier: '2',
    state: 'finished',
    roller: 'test',
    rollerIcon: 'icon',
    id: 'id',
  };
  expect(rollTotal(roll)).toBe(10);
});

test('works with empty modifier', () => {
  const roll: DiceState = {
    dice: {
      d6: {
        dice: [8, 2, 43],
        needs: 3,
      },
      d8: {
        dice: [],
        needs: 0,
      },
      d10: {
        dice: [],
        needs: 0,
      },
      d12: {
        dice: [24, 25, 26],
        needs: 0,
      },
      d20: {
        dice: [],
        needs: 0,
      },
      d100: {
        dice: [],
        needs: 0,
      },
    },
    modifier: '',
    state: 'finished',
    roller: 'test',
    rollerIcon: 'icon',
    id: 'id',
  };
  expect(rollTotal(roll)).toBe(14);
});
