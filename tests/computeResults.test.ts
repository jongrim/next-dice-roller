import { computeResults } from '../pages/room/[name]';
import { DiceInterface } from '../types/dice';

describe('computedResults', () => {
  it('produces correct results', () => {
    const start: DiceInterface = {
      d2: {
        results: [],
        needs: 1,
        sides: 2,
      },
      d4: {
        results: [],
        needs: 0,
        sides: 4,
      },
      d6: {
        results: [],
        needs: 2,
        sides: 6,
      },
      d8: {
        results: [],
        needs: 2,
        sides: 8,
      },
      d10: {
        results: [],
        needs: 0,
        sides: 10,
      },
      d12: {
        results: [],
        needs: 2,
        sides: 12,
      },
      d20: {
        results: [],
        needs: 2,
        sides: 20,
      },
      d100: {
        results: [],
        needs: 0,
        sides: 100,
      },
    };
    const next = computeResults(start, 1);
    expect(next.d2.results).toStrictEqual([1]);
    expect(next.d6.results).toStrictEqual([]);

    const another = computeResults(next, 2);
    expect(another.d2.results).toStrictEqual([1]);
    expect(another.d4.results).toStrictEqual([]);
    expect(another.d6.results).toStrictEqual([2]);
  });
});
