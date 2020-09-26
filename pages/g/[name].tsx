import * as React from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Box, Flex } from 'rebass';
import { v4 as uuidv4 } from 'uuid';
import { ThemeProvider } from 'emotion-theming';
import { TweenMax, Elastic } from 'gsap';
import * as R from 'ramda';

import Navbar from '../../components/Navbar';
import UserSetupModal from '../../components/UserSetupModal';
import RollBubbleManager from '../../components/RollBubbleManager';
import RollHistory from '../../components/RollHistory';
import DiceSidebar from './DiceSidebar';

import {
  DiceBlock,
  DiceState,
  DiceInterface,
  diceNeedsSubmission,
  DieNeed,
  Die,
  Roll,
} from '../../types/dice';
import { rollInfo } from '../../components/DiceSelectionForm/DiceSelectionForm';
import useTheme from '../../hooks/useTheme';

let gsap;
let Draggable;

interface GraphicDie {
  id: string;
  bgColor: string;
  fontColor: string;
  sides: number;
}

const tempDice: GraphicDie[] = [
  {
    id: 'dot-1',
    bgColor: '#CC3363',
    fontColor: '#fff',
    sides: 6,
  },
  {
    id: 'dot-2',
    bgColor: '#9AD1D4',
    fontColor: '#333',
    sides: 12,
  },
  {
    id: 'dot-3',
    bgColor: '#62C370',
    fontColor: '#333',
    sides: 20,
  },
];

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
      const newRolls = [
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

export default function GraphicDiceRoom() {
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
  const { theme, toggleTheme } = useTheme();

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
  }, [name, Draggable]);

  // emit rolls
  React.useEffect(() => {
    if (state.state === 'rolling') {
      if (socket && socket.connected) {
        socket.emit('roll', { state });
      }
    }
  }, [state.state]);

  // Draggable dice
  const [graphicDice, setGraphicDice] = React.useState(tempDice);
  const el = React.useRef();
  React.useEffect(() => {
    async function load() {
      const { gsap: g, Draggable: D } = await import('gsap/all');
      gsap = g;
      Draggable = D;
      gsap.registerPlugin(Draggable);
    }
    if (socket) {
      load().then(() => {
        Draggable.create(
          graphicDice.map(({ id }) => `#${id}`),
          {
            type: 'x,y',
            bounds: document.getElementById('dicebox'),
            onDragEnd: function () {
              socket.emit('drag', {
                dragEvent: {
                  id: this.target.id,
                  left: this.endX,
                  top: this.endY,
                },
              });
            },
          }
        );
      });
    } else {
      if (gsap && Draggable) {
        Draggable.create(
          graphicDice.map(({ id }) => `#${id}`),
          {
            type: 'x,y',
            bounds: document.getElementById('dicebox'),
            onDragEnd: () => {
              console.log('dragend');
            },
          }
        );
      }
    }
  }, [graphicDice, socket]);

  // Drag dice when moved
  React.useEffect(() => {
    if (socket && Draggable) {
      socket.on('drag', ({ dragEvent }) => {
        TweenMax.to(document.getElementById(dragEvent.id), {
          x: dragEvent.left,
          y: dragEvent.top,
          ease: Elastic.easeOut.config(1, 1),
          duration: 0.5,
        });
      });
    }
  }, [socket, Draggable]);

  return (
    <ThemeProvider theme={theme.value}>
      <Navbar
        connected={connected}
        connectedUsers={connectedUsers}
        name={name}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <Flex bg="background" width="100%" flex="1" minHeight="0">
        <DiceSidebar />
        <Box id="dicebox" width="100%">
          {graphicDice.map((d) => (
            <Box
              id={d.id}
              key={d.id}
              width="3rem"
              height="3rem"
              style={{ border: '1px solid #251fdd' }}
              ref={d.id === 'dot-2' ? el : null}
            >
              {d.id}
            </Box>
          ))}
        </Box>
        {/* <Box as="main" flex="1" minHeight="0" maxWidth="1280px" bg="background">
          <RollHistory rolls={state.rolls} />
        </Box> */}
        <RollBubbleManager rolls={state.rolls} />
        <UserSetupModal
          storedUsername={storedUsername}
          setStoredUsername={setStoredUsername}
          onDone={() => {
            socket?.emit('register-user', storedUsername);
          }}
        />
      </Flex>
    </ThemeProvider>
  );
}
