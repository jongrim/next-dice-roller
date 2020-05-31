import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Box, Button, Flex, Image, Text } from 'rebass';
import { v4 as uuidv4 } from 'uuid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'react-tippy';

import UserSetupModal from '../../components/UserSetupModal';
import DiceSelectionForm from '../../components/DiceSelectionForm/DiceSelectionForm';
import RollBubbleManager from '../../components/RollBubbleManager';
import RollResultsTable from '../../components/RollResultsTable';
import RollHistory from '../../components/RollHistory';

import {
  DiceBlock,
  DiceState,
  DiceInterface,
  diceNeedsSubmission,
} from '../../types/dice';

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
    d2: { ...makeDiceBlock() },
    d4: { ...makeDiceBlock() },
    d6: { ...makeDiceBlock() },
    d8: { ...makeDiceBlock() },
    d10: { ...makeDiceBlock() },
    d12: { ...makeDiceBlock() },
    d20: { ...makeDiceBlock() },
    d100: { ...makeDiceBlock() },
  },
  roller: 'anonymous',
  id: '',
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
        name?: string;
        modifier?: string;
      };
    }
  | { type: 'roll'; payload: DiceState };

const diceNeedsMet = (dieBlock: DiceBlock) =>
  dieBlock.dice.length == dieBlock.needs;
const not = (fn) => (...args) => !fn(...args);
const diceNeedsNotMet = not(diceNeedsMet);

export const computeResults = (
  acc: DiceInterface,
  cur: number
): DiceInterface => {
  const { d2, d4, d6, d8, d10, d12, d20, d100 } = acc;
  if (diceNeedsNotMet(d2)) {
    acc.d2 = updateDiceBlock(d2, cur);
  } else if (diceNeedsNotMet(d4)) {
    acc.d4 = updateDiceBlock(d4, cur);
  } else if (diceNeedsNotMet(d6)) {
    acc.d6 = updateDiceBlock(d6, cur);
  } else if (diceNeedsNotMet(d8)) {
    acc.d8 = updateDiceBlock(d8, cur);
  } else if (diceNeedsNotMet(d10)) {
    acc.d10 = updateDiceBlock(d10, cur);
  } else if (diceNeedsNotMet(d12)) {
    acc.d12 = updateDiceBlock(d12, cur);
  } else if (diceNeedsNotMet(d20)) {
    acc.d20 = updateDiceBlock(d20, cur);
  } else if (diceNeedsNotMet(d100)) {
    acc.d100 = updateDiceBlock(d100, cur);
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
  d2,
  d4,
  d6,
  d8,
  d10,
  d12,
  d20,
  d100,
}: diceNeedsSubmission): DiceInterface => ({
  d2: assignNeeds({ needs: d2 }),
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
  const [connected, setConnected] = React.useState(false);
  const [connectedUsers, setConnectedUsers] = React.useState([]);
  const [storedUsername, setStoredUsername] = React.useState('');

  const roll = (
    {
      d2 = 0,
      d4 = 0,
      d6 = 0,
      d8 = 0,
      d10 = 0,
      d12 = 0,
      d20 = 0,
      d100 = 0,
    }: diceNeedsSubmission,
    { name, modifier } = { name: '', modifier: '0' }
  ) => {
    dispatch({
      type: 'submit',
      payload: { d2, d4, d6, d8, d10, d12, d20, d100 },
    });
    window
      .fetch('/api/random', {
        method: 'POST',
        body: JSON.stringify({
          size: [d2, d4, d6, d8, d10, d12, d20, d100]
            .filter(Boolean)
            .reduce(sum, 0),
        }),
      })
      .then((res) => res.json())
      .then(({ nums }) => {
        dispatch({
          type: 'compute',
          payload: {
            data: nums.data,
            roller: storedUsername,
            name,
            modifier,
          },
        });
      });
  };

  // connect to socket
  React.useEffect(() => {
    if (name) {
      const ioSocket = io(`/${name}`, { reconnectionAttempts: 5 });
      setSocket(ioSocket);
      ioSocket.on('connect', () => setConnected(true));
      ioSocket.on('disconnect', () => setConnected(false));
      ioSocket.on('connect_error', () => {
        console.log('connect error');
      });
      ioSocket.on('reconnecting', () => {
        console.log('reconnecting');
      });
      ioSocket.on('reconnect_failed', () => {
        console.log('reconnect failed');
      });
      ioSocket.on('update-users', (users) => {
        setConnectedUsers(users);
      });
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
        <Box px={3}>
          <Tooltip
            arrow
            html={
              connected ? (
                <Flex flexDirection="column">
                  <Text>Connected Users</Text>
                  {connectedUsers.map((user) => (
                    <Text key={user.id}>{user.username}</Text>
                  ))}
                </Flex>
              ) : (
                <Flex flexDirection="column" maxWidth="128px">
                  <Text>Not connected</Text>
                  <Text>Click the icon to make a new room</Text>
                </Flex>
              )
            }
          >
            {connected ? (
              <Image src="/phone-on.svg" alt="connected" />
            ) : (
              <Button
                variant="clear"
                onClick={() => {
                  window
                    .fetch('/api/new-room', { method: 'POST' })
                    .then((res) => res.json())
                    .then(({ name }) => {
                      Router.push(`/room/${name}`);
                    });
                }}
              >
                <Image src="/phone-off.svg" alt="not connected" />
              </Button>
            )}
          </Tooltip>
        </Box>
        <Box pl={3}>
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
        maxWidth="1280px"
        p={3}
        flexDirection={['column', 'column', 'row']}
      >
        <Flex
          flex="2"
          sx={{ order: 1 }}
          flexDirection={['column', 'row', 'row']}
        >
          <Box
            as="section"
            width={['100%', 1 / 2, 1 / 2]}
            sx={{ order: [2, 1, 1] }}
          >
            <DiceSelectionForm onSubmit={roll} />
          </Box>
          <Flex
            as="section"
            flex="1"
            sx={{ order: [1, 2, 2] }}
            flexDirection="column"
            minHeight="265px"
          >
            <RollResultsTable roll={state} />
          </Flex>
        </Flex>
        <Flex as="section" flex="1" sx={{ order: 2 }} flexDirection="column">
          <RollHistory rolls={rolls} />
        </Flex>
        <RollBubbleManager rolls={rolls} />
        <UserSetupModal
          storedUsername={storedUsername}
          setStoredUsername={setStoredUsername}
          onDone={() => {
            socket?.emit('register-user', storedUsername);
          }}
        />
      </Flex>
    </>
  );
}
