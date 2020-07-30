import { rollTotal } from './rollMath';
import { DiceState } from '../types/dice';

test('rollTotal adds up the roll total', () => {
  const roll: DiceState = {
    dice: {
      d2: {
        results: [],
        needs: 0,
        sides: 2,
      },
      d4: {
        results: [],
        needs: 0,
        sides: 4,
      },
      d6: {
        results: [8, 2, 43],
        needs: 3,
        sides: 6,
      },
      d8: {
        results: [],
        needs: 0,
        sides: 8,
      },
      d10: {
        results: [],
        needs: 0,
        sides: 10,
      },
      d12: {
        results: [],
        needs: 0,
        sides: 12,
      },
      d20: {
        results: [],
        needs: 0,
        sides: 20,
      },
      d100: {
        results: [],
        needs: 0,
        sides: 100,
      },
    },
    modifier: '2',
    state: 'finished',
    roller: 'test',
    id: 'id',
  };
  expect(rollTotal(roll)).toBe(10);
});

test('works with empty modifier', () => {
  const roll: DiceState = {
    dice: {
      d6: {
        sides: 6,
        results: [8, 2, 43],
        needs: 3,
      },
      d8: {
        sides: 8,
        results: [],
        needs: 0,
      },
      d10: {
        sides: 10,
        results: [],
        needs: 0,
      },
      d12: {
        sides: 12,
        results: [24, 25, 26],
        needs: 0,
      },
      d20: {
        sides: 20,
        results: [],
        needs: 0,
      },
      d100: {
        sides: 100,
        results: [],
        needs: 0,
      },
      RandomDie: {
        sides: 7,
        results: [14],
        needs: 1,
      },
    },
    modifier: '',
    state: 'finished',
    roller: 'test',
    id: 'id',
  };
  expect(rollTotal(roll)).toBe(15);
});
