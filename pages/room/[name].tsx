import * as React from 'react';
import Link from 'next/link';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Box, Button, Flex, Image } from 'rebass';
import { v4 as uuidv4 } from 'uuid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'react-tippy';

import UserSetupModal from '../../components/UserSetupModal';
import DiceSelectionForm from '../../components/DiceSelectionForm/DiceSelectionForm';
import RollBubbleManager from '../../components/RollBubbleManager';
import RollResultsTable from '../../components/RollResultsTable';
import RollHistory from '../../components/RollHistory';

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
    d4: { ...makeDiceBlock() },
    d6: { ...makeDiceBlock() },
    d8: { ...makeDiceBlock() },
    d10: { ...makeDiceBlock() },
    d12: { ...makeDiceBlock() },
    d20: { ...makeDiceBlock() },
    d100: { ...makeDiceBlock() },
  },
  roller: 'anonymous',
  rollerIcon: '',
  id: '',
};

type diceNeedsSubmission = {
  d4?: number;
  d6?: number;
  d8?: number;
  d10?: number;
  d12?: number;
  d20?: number;
  d100?: number;
};

type DiceEvent =
  | {
      type: 'submit';
      payload: diceNeedsSubmission;
    }
  | {
      type: 'compute';
      payload: {
        data: number[];
        roller: string;
        rollerIcon: string;
        name?: string;
        modifier?: string;
      };
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
  return { ...acc };
};

function updateDiceBlock(diceBlock: DiceBlock, num: number): DiceBlock {
  return {
    dice: [...diceBlock.dice, num],
    needs: diceBlock.needs,
  };
}

const assignNeeds = (needs: { needs: number }): DiceBlock =>
  Object.assign({}, makeDiceBlock(), needs);

const makeDiceNeeds = ({
  d4,
  d6,
  d8,
  d10,
  d12,
  d20,
  d100,
}: diceNeedsSubmission): DiceInterface => ({
  d4: assignNeeds({ needs: d4 }),
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
        name: event.payload.name,
        modifier: event.payload.modifier,
        id: uuidv4(),
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
  const [userIcon, setUserIcon] = React.useState('');
  const [storedUsername, setStoredUsername] = React.useState('');

  const roll = (
    {
      d6 = 0,
      d8 = 0,
      d10 = 0,
      d12 = 0,
      d20 = 0,
      d100 = 0,
    }: diceNeedsSubmission,
    { name, modifier } = { name: '', modifier: '0' }
  ) => {
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
            name,
            modifier,
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
        setRolls((cur) => [state, ...cur]);
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

  return (
    <>
      <Flex
        height="60px"
        width="100%"
        px={3}
        bg="muted"
        justifyContent="flex-end"
        alignItems="center"
        sx={{
          boxShadow: `
  0 0.1px 2.2px rgba(0, 0, 0, 0.02),
  0 0.1px 5.3px rgba(0, 0, 0, 0.028),
  0 0.3px 10px rgba(0, 0, 0, 0.035),
  0 0.4px 17.9px rgba(0, 0, 0, 0.042),
  0 0.8px 33.4px rgba(0, 0, 0, 0.05),
  0 2px 80px rgba(0, 0, 0, 0.07)`,
        }}
      >
        <Box mr="auto">
          <Link href="/">
            <a href="/" target="_blank">
              <Image src="/home.svg" alt="Home" />
            </a>
          </Link>
        </Box>
        <Tooltip arrow title="Copy room URL">
          <CopyToClipboard
            text={`https://obscure-ridge-20711.herokuapp.com/${name}`}
          >
            <Button variant="clear" onClick={() => {}}>
              <Image src="/copy.svg" alt="copy" />
            </Button>
          </CopyToClipboard>
        </Tooltip>
        <Box ml={2}>
          <Tooltip arrow title="About">
            <Link href="/about">
              <a href="/about" target="_blank">
                <Image src="/help-circle.svg" alt="help" />
              </a>
            </Link>
          </Tooltip>
        </Box>
      </Flex>
      <Flex
        as="main"
        flex="1"
        minHeight="0"
        p={3}
        flexDirection={['column', 'row', 'row']}
      >
        <Box
          as="section"
          width={['100%', 1 / 2, 1 / 3]}
          sx={{ order: [2, 1, 1] }}
        >
          <DiceSelectionForm onSubmit={roll} />
        </Box>
        <Flex
          as="section"
          flex="1"
          sx={{ order: [1, 2, 2] }}
          flexDirection={['column', 'column', 'row']}
          height="100%"
        >
          <RollResultsTable roll={state} />
          <RollHistory rolls={rolls} />
        </Flex>
        <RollBubbleManager rolls={rolls} />
        <UserSetupModal
          storedUsername={storedUsername}
          setStoredUsername={setStoredUsername}
          userIcon={userIcon}
          setUserIcon={setUserIcon}
        />
      </Flex>
    </>
  );
}
