import * as React from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Box, Flex, Heading } from 'rebass';

import UserSetupModal from '../../components/UserSetupModal';
import DiceSelectionForm from '../../components/DiceSelectionForm/DiceSelectionForm';
import RollBubbleManager from '../../components/RollBubbleManager';
import RollResultsTable from '../../components/RollResultsTable';
import Sidebar from '../../components/Sidebar';
import useLocalStorage from '../../hooks/useLocalStorage';

import { DiceBlock, DiceState, DiceInterface } from '../../types/dice';

const sum = (x: number, y: number) => x + y;

const diceStates = {
  pending: 'pending',
  rolling: 'rolling',
  finished: 'finished',
};

const makeDiceBlock = (): DiceBlock => ({ dice: [], needs: 0 });

const diceInitialResultsState: DiceState = {
  state: diceStates.pending,
  dice: {
    d6: { ...makeDiceBlock() },
    d8: { ...makeDiceBlock() },
    d10: { ...makeDiceBlock() },
    d12: { ...makeDiceBlock() },
    d20: { ...makeDiceBlock() },
    d100: { ...makeDiceBlock() },
  },
  roller: 'anonymous',
  rollerIcon: '',
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
  | {
      type: 'compute';
      payload: { data: number[]; roller: string; rollerIcon: string };
    }
  | { type: 'roll'; payload: DiceState };

const computeResults = (acc: DiceInterface, cur: number): DiceInterface => {
  if (acc.d6.dice.length != acc.d6.needs) {
    acc.d6 = updateDiceBlock(acc.d6, cur);
  } else if (acc.d8.dice.length != acc.d8.needs) {
    acc.d8 = updateDiceBlock(acc.d8, cur);
  } else if (acc.d10.dice.length != acc.d10.needs) {
    acc.d10 = updateDiceBlock(acc.d10, cur);
  } else if (acc.d12.dice.length != acc.d12.needs) {
    acc.d12 = updateDiceBlock(acc.d12, cur);
  } else if (acc.d20.dice.length != acc.d20.needs) {
    acc.d20 = updateDiceBlock(acc.d20, cur);
  } else if (acc.d100.dice.length != acc.d100.needs) {
    acc.d100 = updateDiceBlock(acc.d100, cur);
  }
  return acc;
};

function updateDiceBlock(diceBlock: DiceBlock, num: number): DiceBlock {
  return {
    dice: [...diceBlock.dice, num],
    needs: diceBlock.needs,
  };
}

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
        state: diceStates.pending,
        ...diceInitialResultsState,
        dice: { ...makeDiceNeeds(event.payload) },
      };
    case 'compute':
      const newDice = event.payload.data.reduce(computeResults, {
        ...state.dice,
      });
      return {
        dice: newDice,
        state: diceStates.rolling,
        roller: event.payload.roller,
        rollerIcon: event.payload.rollerIcon,
      };
    case 'roll':
      return { ...event.payload, state: diceStates.finished };
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
  const [rolls, setRolls] = React.useState([]);
  const [userIcon] = useLocalStorage('icon', '');
  const [storedUsername] = useLocalStorage('username', '');

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
        dispatch({
          type: 'compute',
          payload: {
            data: nums.data,
            roller: storedUsername,
            rollerIcon: userIcon,
          },
        });
      });
  };

  // connect to socket
  React.useEffect(() => {
    if (name) {
      const ioSocket = io(`/${name}`);
      setSocket(ioSocket);
      ioSocket.on('roll', ({ state }) => {
        /**
         * Note: every socket receives this, including the person that emitted it
         */
        dispatch({ type: 'roll', payload: state });
        // add to history of rolls
        setRolls((cur) => [...cur, state]);
      });
      return () => {
        ioSocket.close();
      };
    }
  }, [name]);

  // emit rolls
  React.useEffect(() => {
    if (state.state === 'rolling') {
      if (socket && socket.connected) {
        socket.emit('roll', { state });
      }
    }
  }, [state.state]);

  console.log(state);

  return (
    <Flex
      as="main"
      flex="1"
      pt="60px"
      px={2}
      flexDirection={['column', 'row', 'row']}>
      <Box as="section" width={['100%', 1 / 4, 1 / 4]}>
        <DiceSelectionForm onSubmit={roll} />
      </Box>
      <Box as="section" mt={4} flex="1">
        <Flex justifyContent="center">
          <Heading as="h2">Results</Heading>
        </Flex>
        <RollResultsTable roll={state} />
        <RollBubbleManager rolls={rolls} />
      </Box>
      <UserSetupModal />
    </Flex>
  );
}
