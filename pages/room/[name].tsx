import * as React from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import Head from 'next/head';

import DiceSelectionForm from '../../components/DiceSelectionForm/DiceSelectionForm';

const sum = (x: number, y: number) => x + y;

const diceStates = {
  pending: 'pending',
  rolling: 'rolling',
  finished: 'finished',
};

interface DiceBlock {
  dice: number[];
  needs: number;
}

const makeDiceBlock = (): DiceBlock => ({ dice: [], needs: 0 });

interface DiceInterface {
  d6: DiceBlock;
  d8: DiceBlock;
  d10: DiceBlock;
  d12: DiceBlock;
  d20: DiceBlock;
  d100: DiceBlock;
}

interface DiceState extends DiceInterface {
  state: string;
}

const diceInitialResultsState: DiceState = {
  state: diceStates.pending,
  d6: { ...makeDiceBlock() },
  d8: { ...makeDiceBlock() },
  d10: { ...makeDiceBlock() },
  d12: { ...makeDiceBlock() },
  d20: { ...makeDiceBlock() },
  d100: { ...makeDiceBlock() },
};

type diceNeedsSubmission = {
  d6: number;
  d8: number;
  d10: number;
  d12: number;
  d20: number;
  d100: number;
};

type DiceEvent =
  | {
      type: 'submit';
      payload: diceNeedsSubmission;
    }
  | { type: 'results'; payload: number[] }
  | { type: 'other-person-roll'; payload: DiceState };

const computeResults = (acc: DiceState, cur: number): DiceState => {
  if (acc.d6.dice.length != acc.d6.needs) {
    acc.d6.dice.push(cur);
  } else if (acc.d8.dice.length != acc.d8.needs) {
    acc.d8.dice.push(cur);
  } else if (acc.d10.dice.length != acc.d10.needs) {
    acc.d10.dice.push(cur);
  } else if (acc.d12.dice.length != acc.d12.needs) {
    acc.d12.dice.push(cur);
  } else if (acc.d20.dice.length != acc.d20.needs) {
    acc.d20.dice.push(cur);
  } else if (acc.d100.dice.length != acc.d100.needs) {
    acc.d100.dice.push(cur);
  }
  return acc;
};

const assignNeeds = (needs: { needs: number }): DiceBlock =>
  Object.assign({}, makeDiceBlock(), needs);

const makeDiceNeeds = ({ d6, d8, d10, d12, d20, d100 }): DiceInterface => ({
  d6: assignNeeds({ needs: d6 }),
  d8: assignNeeds({ needs: d8 }),
  d10: assignNeeds({ needs: d10 }),
  d12: assignNeeds({ needs: d12 }),
  d20: assignNeeds({ needs: d20 }),
  d100: assignNeeds({ needs: d100 }),
});

const diceReducer = (state: DiceState, event: DiceEvent): DiceState => {
  switch (event.type) {
    case 'submit':
      return {
        state: diceStates.rolling,
        ...diceInitialResultsState,
        ...makeDiceNeeds(event.payload),
      };
    case 'results':
      return event.payload.reduce(computeResults, {
        ...state,
        state: diceStates.finished,
      });
    case 'other-person-roll':
      return { ...event.payload };
  }
};

export default function Home() {
  const router = useRouter();
  const { name } = router.query;
  const [socket, setSocket] = React.useState(null);
  const [state, dispatch] = React.useReducer(
    diceReducer,
    diceInitialResultsState
  );

  const roll = ({ d6, d8, d10, d12, d20, d100 }: diceNeedsSubmission) => {
    dispatch({ type: 'submit', payload: { d6, d8, d10, d12, d20, d100 } });
    window
      .fetch('/api/random', {
        method: 'POST',
        body: JSON.stringify({
          size: [d6, d8, d10, d12, d20, d100].filter(Boolean).reduce(sum, 0),
        }),
      })
      .then((res) => res.json())
      .then(({ nums }) => {
        dispatch({ type: 'results', payload: nums.data });
      });
  };

  React.useEffect(() => {
    if (name) {
      const ioSocket = io(`/${name}`);
      setSocket(ioSocket);
      ioSocket.on('other-person-roll', ({ state }) => {
        dispatch({ type: 'other-person-roll', payload: state });
      });
      return () => {
        ioSocket.close();
      };
    }
  }, [name]);

  React.useEffect(() => {
    if (state.state === 'finished') {
      if (socket && socket.connected) {
        socket.emit('other-person-roll', { state });
      }
    }
  }, [state.state]);

  return (
    <div>
      <main>
        <section>
          <h2>Dice Selection</h2>
          <DiceSelectionForm onSubmit={roll} />
        </section>
        <section>
          <h2>Results</h2>
          <h3>D6</h3>
          {state.d6.dice.map((num, i) => (
            <p key={`d6-${i}`}>{(num % 6) + 1}</p>
          ))}
          <h3>D8</h3>
          {state.d8.dice.map((num, i) => (
            <p key={`d8-${i}`}>{(num % 8) + 1}</p>
          ))}
          <h3>D10</h3>
          {state.d10.dice.map((num, i) => (
            <p key={`d10-${i}`}>{(num % 10) + 1}</p>
          ))}
          <h3>D12</h3>
          {state.d12.dice.map((num, i) => (
            <p key={`d12-${i}`}>{(num % 12) + 1}</p>
          ))}
          <h3>D20</h3>
          {state.d20.dice.map((num, i) => (
            <p key={`d20-${i}`}>{(num % 20) + 1}</p>
          ))}
          <h3>D100</h3>
          {state.d100.dice.map((num, i) => (
            <p key={`d100-${i}`}>{(num % 100) + 1}</p>
          ))}
        </section>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
