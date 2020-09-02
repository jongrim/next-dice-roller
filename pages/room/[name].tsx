import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Box, Button, Flex, Text } from 'rebass';
import { v4 as uuidv4 } from 'uuid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'react-tippy';
import { ThemeProvider } from 'emotion-theming';
import * as R from 'ramda';

import lightTheme from '../theme.json';
import darkTheme from '../darkTheme.json';

import UserSetupModal from '../../components/UserSetupModal';
import DiceSelectionForm, {
  rollInfo,
} from '../../components/DiceSelectionForm/DiceSelectionForm';
import RollBubbleManager from '../../components/RollBubbleManager';
import RollResultsTable from '../../components/RollResultsTable';
import RollHistory from '../../components/RollHistory';

import HomeSvg from './HomeSvg';
import CopySvg from './CopyUrlSvg';
import ConnectedSvg from './ConnectedSvg';
import NotConnectedSvg from './NotConnectedSvg';
import AboutSvg from './AboutSvg';

import {
  DiceBlock,
  DiceState,
  DiceInterface,
  diceNeedsSubmission,
  DieNeed,
  Roll,
} from '../../types/dice';
import { Switch } from '@rebass/forms';

const sum = (x: number, y: number) => x + y;

const diceStates = {
  pending: 'pending',
  rolling: 'rolling',
  finished: 'finished',
};

const makeDiceBlock = (): DiceBlock => ({ results: [], needs: 0, sides: 1 });

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
  rolls: [],
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
        addToCurrentRoll: boolean;
      };
    }
  | { type: 'roll'; payload: DiceState };

const diceNeedsMet = (dieBlock: DiceBlock): boolean =>
  dieBlock.results.length == dieBlock.needs;
const not = (fn) => (...args) => !fn(...args);
const diceNeedsNotMet = not(diceNeedsMet);

export const computeResults = (
  acc: DiceInterface,
  cur: number
): DiceInterface => {
  let numberUsed = false;
  const updated = R.mapObjIndexed((val, key) => {
    return R.ifElse(
      diceNeedsNotMet,
      (d) => {
        if (!numberUsed) {
          numberUsed = true;
          return updateDiceBlock(d, cur);
        }
        return d;
      },
      () => acc[key]
    )(val);
  }, acc);
  return updated;
};

function updateDiceBlock(diceBlock: DiceBlock, num: number): DiceBlock {
  return {
    ...diceBlock,
    results: [...diceBlock.results, num],
    needs: diceBlock.needs,
  };
}

const assignNeeds = (die: DiceBlock): DiceBlock =>
  Object.assign({}, makeDiceBlock(), die);

const makeDiceNeeds = (vals: diceNeedsSubmission): DiceInterface =>
  R.mapObjIndexed(assignNeeds, vals);

export const mergeRolls = (rolls: Roll[], newRoll: Roll): Roll[] => {
  const lastRoll = rolls[0];
  const lastRollKeys = Object.keys(lastRoll.dice);
  const newRollKeys = Object.keys(newRoll.dice);
  const allKeys = [...new Set(lastRollKeys.concat(newRollKeys))];
  const merged = R.reduce((acc: DiceInterface, cur: string): DiceInterface => {
    const lastRolledDice = lastRoll.dice[cur] || {
      results: [],
      needs: 0,
      sides: null,
    };
    const newRolledDice = newRoll.dice[cur] || {
      results: [],
      needs: 0,
      sides: null,
    };
    return {
      ...acc,
      [cur]: {
        results: [...lastRolledDice.results, ...newRolledDice.results],
        needs: lastRolledDice.needs + newRolledDice.needs,
        sides: lastRolledDice.sides || newRolledDice.sides,
      },
    };
  }, {})(allKeys);
  const updated = { ...lastRoll, dice: merged };
  return [updated, ...rolls.slice(1)];
};

const diceReducer = (state: DiceState, event: DiceEvent): DiceState => {
  switch (event.type) {
    case 'submit':
      return {
        ...state,
        state: diceStates.pending,
        dice: { ...makeDiceNeeds(event.payload) },
      };
    case 'compute':
      const newDice = event.payload.data.reduce(computeResults, {
        ...state.dice,
      });
      const result = {
        ...state,
        dice: newDice,
        state: diceStates.rolling,
        roller: event.payload.roller,
        name: event.payload.name,
        modifier: event.payload.modifier,
        id: uuidv4(),
        addToCurrentRoll: event.payload.addToCurrentRoll,
      };
      return result;
    case 'roll':
      const newRolls = event.payload.addToCurrentRoll
        ? mergeRolls(state.rolls, event.payload)
        : [
            {
              dice: event.payload.dice,
              roller: event.payload.roller,
              id: event.payload.id,
              name: event.payload.name,
              modifier: event.payload.modifier,
            },
            ...state.rolls,
          ];
      return { ...event.payload, state: diceStates.finished, rolls: newRolls };
  }
};

export default function Home() {
  const router = useRouter();
  const { name } = router.query;
  const [socket, setSocket] = React.useState<SocketIOClient.Socket>(null);
  const [state, dispatch] = React.useReducer(
    diceReducer,
    diceInitialResultsState
  );
  const [connected, setConnected] = React.useState(false);
  const [connectedUsers, setConnectedUsers] = React.useState([]);
  const [storedUsername, setStoredUsername] = React.useState('');
  const [theme, setTheme] = React.useState<{ label: string; value: object }>({
    label: 'light',
    value: lightTheme,
  });

  const toggleTheme = () =>
    setTheme((curTheme) => {
      if (curTheme.label === 'light') {
        return { label: 'dark', value: darkTheme };
      }
      return { label: 'light', value: lightTheme };
    });

  React.useLayoutEffect(() => {
    const userTheme = window.localStorage.getItem('theme');
    if (!userTheme) {
      // user doesn't have a set theme, so use system preference
      const mqList = window.matchMedia('(prefers-color-scheme: dark)');
      if (mqList.matches) {
        setTheme({ label: 'dark', value: darkTheme });
      }
    }
    if (userTheme === 'dark') {
      setTheme({ label: 'dark', value: darkTheme });
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem('theme', theme.label);
  }, [theme]);

  const roll = (
    dice: diceNeedsSubmission,
    { name, modifier, addToCurrentRoll }: rollInfo = {
      name: '',
      modifier: '0',
      addToCurrentRoll: false,
    }
  ) => {
    dispatch({
      type: 'submit',
      payload: dice,
    });
    window
      .fetch('/api/random', {
        method: 'POST',
        body: JSON.stringify({
          // figure out the amount of numbers we need - sum of all quantities
          size: R.reduce((acc: number, [key, val]: [string, DieNeed]) => {
            return acc + val.needs;
          }, 0)(Object.entries(dice)),
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
            addToCurrentRoll,
          },
        });
      });
  };

  // connect to socket
  React.useEffect(() => {
    if (name) {
      const ioSocket = io(`/${name}`, {
        reconnectionAttempts: 5,
        query: { name },
      });
      setSocket(ioSocket);
      ioSocket.on('connect', () => setConnected(true));
      ioSocket.on('disconnect', () => setConnected(false));
      ioSocket.on('connect_error', () => {
        console.log('connect error');
      });
      ioSocket.on('reconnect', () => {
        console.log('reconnected');
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
    <ThemeProvider theme={theme.value}>
      <Flex
        height="60px"
        width="100%"
        px={3}
        bg="background"
        justifyContent="flex-end"
        alignItems="center"
        sx={(style) => ({
          borderBottom: `1px ${style.colors.text} solid`,
        })}
      >
        <Box mr="auto">
          <Link href="/">
            <a href="/" target="_blank">
              <HomeSvg />
            </a>
          </Link>
        </Box>
        <Switch
          mr={3}
          onClick={toggleTheme}
          color="text"
          sx={{
            borderColor: 'text',
            borderWidth: '2px',
            '& > div': {
              marginTop: '-2px',
              marginLeft: '-2px',
              borderColor: 'text',
              borderWidth: '2px',
            },
            '&[aria-checked=true]': {
              backgroundColor: 'transparent',
            },
          }}
          checked={theme.label === 'dark'}
        />
        <Tooltip arrow title="Copy room URL">
          <CopyToClipboard text={`https://rollwithme.xyz/room/${name}`}>
            <Button variant="clear" onClick={() => {}}>
              <CopySvg />
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
              <ConnectedSvg />
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
                <NotConnectedSvg />
              </Button>
            )}
          </Tooltip>
        </Box>
        <Box pl={3}>
          <Tooltip arrow title="About">
            <Link href="/about">
              <a href="/about" target="_blank">
                <AboutSvg />
              </a>
            </Link>
          </Tooltip>
        </Box>
      </Flex>
      <Flex
        bg="background"
        width="100%"
        flex="1"
        minHeight="0"
        justifyContent="center"
        p={3}
      >
        <Flex
          as="main"
          flex="1"
          minHeight="0"
          maxWidth="1280px"
          bg="background"
          flexDirection={['column', 'column', 'row']}
        >
          <Box
            flex="2"
            sx={{
              display: 'grid',
              gridGap: 2, // theme.space[3]
              gridTemplateColumns: ['1fr 1fr 1fr', '1fr 1fr', '1fr 1fr 1fr'],
            }}
          >
            <Box
              as="section"
              sx={{
                gridColumn: ['1 / 4', '1', '1'],
                gridRow: ['2', '1', '1'],
              }}
            >
              <DiceSelectionForm
                onSubmit={roll}
                hasRolls={state.rolls.length > 0}
                socket={socket}
              />
            </Box>
            <Flex
              as="section"
              sx={{ gridColumn: ['1 / 4', '2', '2'], gridRow: ['1', '1', '1'] }}
              flexDirection="column"
              minHeight="265px"
            >
              <RollResultsTable roll={state.rolls[0]} />
            </Flex>
            <Flex
              as="section"
              sx={{
                gridColumn: ['1 / 4', '1 / 3', '3'],
                gridRow: ['3', '2', '1'],
              }}
              flexDirection="column"
            >
              <RollHistory rolls={state.rolls} />
            </Flex>
          </Box>
          <RollBubbleManager rolls={state.rolls} />
          <UserSetupModal
            storedUsername={storedUsername}
            setStoredUsername={setStoredUsername}
            onDone={() => {
              socket?.emit('register-user', storedUsername);
            }}
          />
        </Flex>
      </Flex>
    </ThemeProvider>
  );
}
