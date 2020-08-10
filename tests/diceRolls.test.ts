import { computeResults, mergeRolls } from '../pages/room/[name]';
import { DiceInterface, Roll } from '../types/dice';

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

describe('mergeRolls', () => {
  it('merges two rolls together', () => {
    const roll1: Roll = {
      dice: {
        d6: {
          results: [8, 2],
          needs: 2,
          sides: 6,
        },
      },
      roller: 'tester',
      id: '1',
      name: 'roll1',
      modifier: '-1',
    };
    const roll2: Roll = {
      dice: {
        d4: {
          results: [8, 2],
          needs: 2,
          sides: 4,
        },
        d6: {
          results: [1],
          needs: 1,
          sides: 6,
        },
      },
      roller: 'new-tester',
      id: '2',
      name: 'roll2',
      modifier: '',
    };
    expect(mergeRolls([roll1], roll2)).toEqual([
      {
        dice: {
          d4: {
            results: [8, 2],
            needs: 2,
            sides: 4,
          },
          d6: {
            results: [8, 2, 1],
            needs: 3,
            sides: 6,
          },
        },
        roller: 'tester',
        id: '1',
        name: 'roll1',
        modifier: '-1',
      },
    ]);
  });
});
