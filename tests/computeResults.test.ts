import { computeResults } from '../pages/room/[name]';
import { DiceInterface } from '../types/dice';

describe('computedResults', () => {
  it('produces correct results', () => {
    const start: DiceInterface = {
      d2: {
        dice: [],
        needs: 1,
      },
      d4: {
        dice: [],
        needs: 0,
      },
      d6: {
        dice: [],
        needs: 2,
      },
      d8: {
        dice: [],
        needs: 2,
      },
      d10: {
        dice: [],
        needs: 0,
      },
      d12: {
        dice: [],
        needs: 2,
      },
      d20: {
        dice: [],
        needs: 2,
      },
      d100: {
        dice: [],
        needs: 0,
      },
    };
    const next = computeResults(start, 1);
    expect(next.d2.dice).toStrictEqual([1]);
    expect(next.d6.dice).toStrictEqual([]);

    const another = computeResults(next, 2);
    expect(another.d2.dice).toStrictEqual([1]);
    expect(another.d4.dice).toStrictEqual([]);
    expect(another.d6.dice).toStrictEqual([2]);
  });
});
