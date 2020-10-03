import * as React from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Box, Button, Flex, Text } from 'rebass';
import { ThemeProvider } from 'emotion-theming';
import gsap, { Elastic } from 'gsap';
import FsLightbox from 'fslightbox-react';
import { Tooltip } from 'react-tippy';
import styles from './die.module.css';

import number0 from '@iconify/icons-ri/number-0';
import number1 from '@iconify/icons-ri/number-1';
import number2 from '@iconify/icons-ri/number-2';
import number3 from '@iconify/icons-ri/number-3';
import number4 from '@iconify/icons-ri/number-4';
import number5 from '@iconify/icons-ri/number-5';
import number6 from '@iconify/icons-ri/number-6';
import number7 from '@iconify/icons-ri/number-7';
import number8 from '@iconify/icons-ri/number-8';
import number9 from '@iconify/icons-ri/number-9';

import shapeTriangle from '@iconify/icons-mdi-light/shape-triangle';
import shapeSquare from '@iconify/icons-mdi-light/shape-square';
import shapeRhombus from '@iconify/icons-mdi-light/shape-rhombus';
import shapeOctagon from '@iconify/icons-mdi-light/shape-octagon';
import shapeHexagon from '@iconify/icons-mdi-light/shape-hexagon';
import decagramOutline from '@iconify/icons-mdi/decagram-outline';
import refreshIcon from '@iconify/icons-mdi-light/refresh';
import deleteIcon from '@iconify/icons-mdi-light/delete';
import pictureIcon from '@iconify/icons-mdi-light/picture';
import coinIcon from '@iconify/icons-system-uicons/coin';

import arrowRight from '@iconify/icons-mdi-light/arrow-right';
import arrowLeft from '@iconify/icons-mdi-light/arrow-left';

import Navbar from '../../components/Navbar';
import UserSetupModal from '../../components/UserSetupModal';
import GraphicRollHistory from '../../components/GraphicRollHistory';
import DiceSidebar from '../../components/DiceSidebar';

import { GraphicDie } from '../../types/dice';
import useTheme from '../../hooks/useTheme';
import _Draggable from 'gsap/Draggable';
import { Icon } from '@iconify/react';
import { Clock } from '../../types/clock';
import BetaWarningModal from '../../components/BetaWarningModal';
import { Img } from '../../types/image';

import { CLIENT_ID } from '../../components/DiceSidebar';
import Token from '../../types/token';

const getNumberIcon = (num: number) => {
  switch (num) {
    case 0:
      return number0;
    case 1:
      return number1;
    case 2:
      return number2;
    case 3:
      return number3;
    case 4:
      return number4;
    case 5:
      return number5;
    case 6:
      return number6;
    case 7:
      return number7;
    case 8:
      return number8;
    case 9:
      return number9;
    default:
      return null;
  }
};

const diceStates = {
  waiting: 'waiting',
  rolling: 'rolling',
  finished: 'finished',
};

interface Roll {
  roller: string;
  total: number;
  dice: GraphicDie[];
}
interface GraphicDiceResultsState {
  state: string;
  dice: GraphicDie[];
  clocks: Clock[];
  imgs: Img[];
  tokens: Token[];
  rolls: Roll[];
  roller: string;
}

const diceInitialResultsState: GraphicDiceResultsState = {
  state: diceStates.waiting,
  dice: [],
  clocks: [],
  imgs: [],
  tokens: [],
  rolls: [],
  roller: 'anonymous',
};

type DiceEvent =
  | {
      type: 'submit';
    }
  | {
      type: 'add-die';
      payload: { die: GraphicDie };
    }
  | {
      type: 'remove-item';
      payload: { id: string };
    }
  | {
      type: 'add-clock';
      payload: { clock: Clock };
    }
  | {
      type: 'advance-clock';
      payload: { id: string };
    }
  | {
      type: 'rewind-clock';
      payload: { id: string };
    }
  | {
      type: 'remove-clock';
      payload: { id: string };
    }
  | {
      type: 'add-img';
      payload: { img: Img };
    }
  | {
      type: 'remove-img';
      payload: { id: string };
    }
  | {
      type: 'add-token';
      payload: { token: Token };
    }
  | {
      type: 'remove-token';
      payload: { id: string };
    }
  | {
      type: 'roll';
      payload: { id: string; randNumbers: number[]; roller: string };
    }
  | {
      type: 'group-roll';
      payload: { items: string[]; randNumbers: number[]; roller: string };
    }
  | {
      type: 'emit-state';
      payload: { socket: SocketIOClient.Socket };
    }
  | {
      type: 'sync';
      payload: {
        dice: GraphicDie[];
        clocks: Clock[];
        imgs: Img[];
        tokens: Token[];
        rolls: Roll[];
      };
    };

const diceReducer = (state: GraphicDiceResultsState, event: DiceEvent) => {
  switch (event.type) {
    case 'submit':
      return {
        ...state,
        state: diceStates.rolling,
      };
    case 'add-die':
      return {
        ...state,
        dice: state.dice.concat(event.payload.die),
      };
    case 'add-token':
      return {
        ...state,
        tokens: state.tokens.concat(event.payload.token),
      };
    case 'remove-item':
      return {
        ...state,
        dice: state.dice.filter(({ id }) => id !== event.payload.id),
        clocks: state.clocks.filter(({ id }) => id !== event.payload.id),
        tokens: state.tokens.filter(({ id }) => id !== event.payload.id),
      };
    case 'add-clock':
      return {
        ...state,
        clocks: state.clocks.concat(event.payload.clock),
      };
    case 'advance-clock':
      return {
        ...state,
        clocks: state.clocks.map((c) => {
          if (c.id === event.payload.id) {
            return {
              ...c,
              curSegment: c.curSegment + 1,
            };
          }
          return { ...c };
        }),
      };
    case 'rewind-clock':
      return {
        ...state,
        clocks: state.clocks.map((c) => {
          if (c.id === event.payload.id) {
            return {
              ...c,
              curSegment: c.curSegment - 1,
            };
          }
          return c;
        }),
      };
    case 'remove-clock':
      return {
        ...state,
        clocks: state.clocks.filter(({ id }) => id !== event.payload.id),
      };
    case 'add-img':
      return {
        ...state,
        imgs: state.imgs.concat(event.payload.img),
      };
    case 'remove-img':
      return {
        ...state,
        imgs: state.imgs.filter(({ id }) => id !== event.payload.id),
      };
    case 'emit-state':
      event.payload.socket.emit('sync', {
        clientId: CLIENT_ID,
        dice: state.dice,
        clocks: state.clocks,
        imgs: state.imgs,
        tokens: state.tokens,
        rolls: state.rolls,
      });
      return state;
    case 'sync':
      interface IdObject {
        id: string;
      }
      const { dice, clocks, imgs, tokens, rolls } = event.payload;
      function itemsNotShared<T extends IdObject>(arrA: T[], arrB: T[]): T[] {
        return arrB.filter(({ id }) => !arrA.find(({ id: i }) => id === i));
      }
      return {
        ...state,
        dice: state.dice.concat(itemsNotShared(state.dice, dice)),
        clocks: state.clocks.concat(itemsNotShared(state.clocks, clocks)),
        imgs: state.imgs.concat(itemsNotShared(state.imgs, imgs)),
        tokens: state.tokens.concat(itemsNotShared(state.tokens, tokens)),
        rolls: [...rolls],
      };
    case 'roll':
      let newDie: GraphicDie;
      const newDice = state.dice.map((die) => {
        if (die.id === event.payload.id) {
          newDie = {
            ...die,
            curNumber: (event.payload.randNumbers[0] % die.sides) + 1,
            rollVersion: die.rollVersion + 1,
          };
          return newDie;
        }
        return die;
      });
      return {
        ...state,
        state: diceStates.finished,
        dice: newDice,
        rolls: [
          {
            roller: event.payload.roller,
            total: newDie.curNumber,
            dice: [newDie],
          },
          ...state.rolls,
        ],
      };
    case 'group-roll':
      const numbers = [...event.payload.randNumbers];
      const rolledIds: { [index: string]: GraphicDie } = {};
      const updated = state.dice.map((die) => {
        if (event.payload.items.includes(die.id)) {
          const nextNum = numbers.splice(0, 1);
          const newDie = {
            ...die,
            curNumber: (nextNum[0] % die.sides) + 1,
            rollVersion: die.rollVersion + 1,
          };
          rolledIds[die.id] = newDie;
          return newDie;
        }
        return die;
      });
      const rollTotal = updated.reduce((acc, { id }) => {
        if (rolledIds[id]) {
          return acc + rolledIds[id].curNumber;
        }
        return acc;
      }, 0);
      return {
        ...state,
        state: diceStates.finished,
        dice: updated,
        rolls: [
          {
            roller: event.payload.roller,
            total: rollTotal,
            dice: Object.values(rolledIds),
          },
          ...state.rolls,
        ],
      };
  }
};

export default function GraphicDiceRoom(): React.ReactElement {
  const router = useRouter();
  const { name } = router.query;
  const [socket, setSocket] = React.useState<SocketIOClient.Socket>(null);
  const [state, dispatch] = React.useReducer(
    diceReducer,
    diceInitialResultsState
  );
  const [connected, setConnected] = React.useState(false);
  const [bgImage, setBgImage] = React.useState('');
  const [connectedUsers, setConnectedUsers] = React.useState([]);
  const [storedUsername, setStoredUsername] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [lighthouseToggler, toggleLighthouse] = React.useState(false);
  const [{ Draggable }, setDraggable] = React.useState<{
    Draggable: typeof _Draggable;
  }>({ Draggable: undefined });
  const { theme, toggleTheme } = useTheme();

  const roll = React.useCallback(
    ({ id }) => {
      dispatch({
        type: 'submit',
      });
      window
        .fetch('/api/random', {
          method: 'POST',
          body: JSON.stringify({
            size: 1,
          }),
        })
        .then((res) => res.json())
        .then(({ nums }) => {
          socket.emit('roll', { id, nums, user: storedUsername });
        });
    },
    [socket, storedUsername]
  );

  const groupRoll = React.useCallback(
    (items: string[], user: string) => {
      dispatch({
        type: 'submit',
      });
      window
        .fetch('/api/random', {
          method: 'POST',
          body: JSON.stringify({
            size: items.length,
          }),
        })
        .then((res) => res.json())
        .then(({ nums }) => {
          socket.emit('group-roll', { items, nums, user });
        });
    },
    [socket]
  );

  const addToSelected = (id: string) => {
    setSelectedItems((cur) => [...cur, id]);
  };
  const removeFromSelected = (id: string) => {
    setSelectedItems((cur) => cur.filter((i) => i !== id));
  };
  const onSelect = React.useCallback(
    (id: string) => {
      selectedItems.includes(id) ? removeFromSelected(id) : addToSelected(id);
    },
    [selectedItems]
  );

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
      ioSocket.on('roll', ({ id, nums, user }) => {
        /**
         * Note: every socket receives this, including the person that emitted it
         */
        dispatch({
          type: 'roll',
          payload: {
            id,
            randNumbers: nums.data,
            roller: user,
          },
        });
      });
      ioSocket.on('group-roll', ({ items, nums, user }) => {
        /**
         * Note: every socket receives this, including the person that emitted it
         */
        dispatch({
          type: 'group-roll',
          payload: {
            items,
            randNumbers: nums.data,
            roller: user,
          },
        });
      });
      ioSocket.on('add-g-die', ({ die }) =>
        dispatch({ type: 'add-die', payload: { die } })
      );
      ioSocket.on('remove-items', ({ items }) => {
        items.forEach((id) => {
          dispatch({ type: 'remove-item', payload: { id } });
        });
      });
      ioSocket.on('add-clock', ({ clock }) =>
        dispatch({ type: 'add-clock', payload: { clock } })
      );
      ioSocket.on('advance-clock', ({ id }) =>
        dispatch({
          type: 'advance-clock',
          payload: {
            id,
          },
        })
      );
      ioSocket.on('rewind-clock', ({ id }) =>
        dispatch({
          type: 'rewind-clock',
          payload: {
            id,
          },
        })
      );
      ioSocket.on('remove-clock', ({ id }) =>
        dispatch({ type: 'remove-clock', payload: { id } })
      );
      ioSocket.on('add-img', ({ img }) => {
        dispatch({ type: 'add-img', payload: { img } });
      });
      ioSocket.on('remove-img', ({ id }) => {
        dispatch({ type: 'remove-img', payload: { id } });
      });
      ioSocket.on('add-token', ({ token }) => {
        dispatch({ type: 'add-token', payload: { token } });
      });
      ioSocket.on('set-bg', ({ bgImg }) => {
        setBgImage(bgImg);
      });
      ioSocket.on(
        'sync',
        ({
          clientId,
          ...rest
        }: {
          dice: GraphicDie[];
          clocks: Clock[];
          imgs: Img[];
          tokens: Token[];
          rolls: Roll[];
          clientId: string;
        }) => {
          dispatch({ type: 'sync', payload: rest });
        }
      );
      ioSocket.emit('request-sync', { clientId: CLIENT_ID });
      return () => {
        ioSocket.close();
      };
    }
  }, [name]);

  // Syncing
  React.useEffect(() => {
    if (socket) {
      socket.on('request-sync', ({ clientId }) => {
        if (clientId !== CLIENT_ID) {
          dispatch({ type: 'emit-state', payload: { socket } });
        }
      });
    }
  }, [socket]);

  // Keyboard events
  React.useEffect(() => {
    const listeners = (ev: KeyboardEvent) => {
      switch (ev.key) {
        case 'Backspace':
          if (selectedItems.length) {
            socket.emit('remove-items', { items: selectedItems });
            setSelectedItems([]);
          }
          break;
        case 'Esc':
        case 'Escape':
          setSelectedItems([]);
          break;
      }
    };
    document.addEventListener('keydown', listeners);
    return () => document.removeEventListener('keydown', listeners);
  }, [selectedItems, storedUsername, groupRoll, socket, roll]);

  // Load draggable
  React.useEffect(() => {
    async function load() {
      const { Draggable: D } = await import('gsap/all');
      setDraggable({ Draggable: D });
    }
    load();
  }, []);

  // Register draggable
  React.useEffect(() => {
    if (gsap && Draggable) {
      // @ts-ignore
      gsap.registerPlugin(Draggable);
    }
  }, [Draggable]);

  // Draggable dice
  React.useEffect(() => {
    if (Draggable) {
      Draggable.create(
        state.dice.map(({ id }) => `#${id}`),
        {
          allowEventDefault: true,
          type: 'x,y',
          bounds: document.getElementById('dicebox'),
          onDragEnd: function () {
            if (selectedItems.length) {
              selectedItems.forEach((id) => {
                socket.emit('drag', {
                  dragEvent: {
                    id,
                    left: this.endX,
                    top: this.endY,
                  },
                });
              });
            }
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
    }
  }, [Draggable, state.dice, selectedItems, socket]);

  // Draggable clocks
  React.useEffect(() => {
    if (Draggable) {
      Draggable.create(
        state.clocks.map(({ id }) => `#${id}`),
        {
          type: 'x,y',
          bounds: document.getElementById('dicebox'),
          onDragEnd: function () {
            if (selectedItems.length) {
              selectedItems.forEach((id) => {
                socket.emit('drag', {
                  dragEvent: {
                    id,
                    left: this.endX,
                    top: this.endY,
                  },
                });
              });
            }
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
    }
  }, [Draggable, state.clocks, selectedItems, socket]);

  // Draggable tokens
  React.useEffect(() => {
    if (Draggable) {
      Draggable.create(
        state.tokens.map(({ id }) => `#${id}`),
        {
          type: 'x,y',
          bounds: document.getElementById('dicebox'),
          onDragEnd: function () {
            if (selectedItems.length) {
              selectedItems.forEach((id) => {
                socket.emit('drag', {
                  dragEvent: {
                    id,
                    left: this.endX,
                    top: this.endY,
                  },
                });
              });
            }
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
    }
  }, [Draggable, state.tokens, selectedItems, socket]);

  // Drag things when moved
  React.useEffect(() => {
    if (socket && Draggable) {
      socket.on('drag', ({ dragEvent }) => {
        gsap.to(document.getElementById(dragEvent.id), {
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
      <Flex
        bg="background"
        width="100%"
        flex="1"
        minHeight="0"
        sx={{ position: 'relative', overflow: 'hidden' }}
      >
        <DiceSidebar
          addDie={React.useCallback(
            (die: GraphicDie) => socket?.emit('add-g-die', { die }),
            [socket]
          )}
          addClock={React.useCallback(
            (clock) => socket?.emit('add-clock', { clock }),
            [socket]
          )}
          addImg={React.useCallback((img) => socket?.emit('add-img', { img }), [
            socket,
          ])}
          removeImg={React.useCallback(
            (id) => socket.emit('remove-img', { id }),
            [socket]
          )}
          addToken={React.useCallback(
            (token: Token) => socket?.emit('add-token', { token }),
            [socket]
          )}
          imgs={state.imgs}
          setBgImage={React.useCallback(
            (bgImg: string) => socket?.emit('set-bg', { bgImg }),
            [socket]
          )}
        />
        <Box
          id="dicebox"
          width="100%"
          onClick={() => {
            setSelectedItems([]);
          }}
          sx={{
            background: bgImage
              ? `center / contain no-repeat url(${bgImage})`
              : undefined,
          }}
        >
          {state.dice.map((d) => {
            switch (d.sides) {
              case 4:
                return (
                  <D4Die
                    {...d}
                    roll={roll}
                    onSelect={onSelect}
                    selected={selectedItems.includes(d.id)}
                    key={d.id}
                    theme={theme.value}
                  />
                );
              case 6:
                return (
                  <D6Die
                    {...d}
                    roll={roll}
                    onSelect={onSelect}
                    selected={selectedItems.includes(d.id)}
                    key={d.id}
                    theme={theme.value}
                  />
                );
              case 8:
                return (
                  <D8Die
                    {...d}
                    roll={roll}
                    onSelect={onSelect}
                    selected={selectedItems.includes(d.id)}
                    key={d.id}
                    theme={theme.value}
                  />
                );
              case 10:
                return (
                  <D10Die
                    {...d}
                    roll={roll}
                    onSelect={onSelect}
                    selected={selectedItems.includes(d.id)}
                    key={d.id}
                    theme={theme.value}
                  />
                );
              case 12:
                return (
                  <D12Die
                    {...d}
                    roll={roll}
                    onSelect={onSelect}
                    selected={selectedItems.includes(d.id)}
                    key={d.id}
                    theme={theme.value}
                  />
                );
              case 20:
                return (
                  <D20Die
                    {...d}
                    roll={roll}
                    onSelect={onSelect}
                    selected={selectedItems.includes(d.id)}
                    key={d.id}
                    theme={theme.value}
                  />
                );
              default:
                return (
                  <DXDie
                    {...d}
                    roll={roll}
                    onSelect={onSelect}
                    selected={selectedItems.includes(d.id)}
                    key={d.id}
                    theme={theme.value}
                  />
                );
            }
          })}
          {state.clocks.map((c) => (
            <ClockPie
              key={c.id}
              {...c}
              socket={socket}
              selected={selectedItems.includes(c.id)}
              onSelect={onSelect}
              theme={theme.value}
            />
          ))}
          {state.tokens.map((token) => (
            <button
              className={styles.die}
              data-selected={selectedItems.includes(token.id)}
              id={token.id}
              key={token.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(token.id);
              }}
            >
              <Icon icon={coinIcon} height="2rem" color={token.bgColor} />
            </button>
          ))}
          {selectedItems.length > 0 && (
            <Flex
              sx={{ position: 'absolute', bottom: '3rem' }}
              width="100%"
              justifyContent="center"
            >
              <Tooltip arrow title="Roll selected dice">
                <Button
                  onClick={(e) => {
                    groupRoll(selectedItems, storedUsername);
                    e.stopPropagation();
                  }}
                  variant="ghost"
                  bg="background"
                  mr={2}
                >
                  <Icon icon={refreshIcon} height="3rem" />
                </Button>
              </Tooltip>
              <Tooltip arrow title="Delete selected items">
                <Button
                  onClick={() => {
                    socket.emit('remove-items', { items: selectedItems });
                  }}
                  variant="ghost"
                  bg="background"
                  ml={2}
                >
                  <Icon icon={deleteIcon} height="3rem" />
                </Button>
              </Tooltip>
            </Flex>
          )}
          {state.imgs.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                right: '3rem',
                top: '48%',
              }}
            >
              <Tooltip
                arrow
                title="Open picture viewer"
                position="left"
                style={{ display: 'inherit' }}
              >
                <Button
                  sx={{
                    border: 'none',
                  }}
                  onClick={() => {
                    toggleLighthouse(!lighthouseToggler);
                  }}
                  variant="ghost"
                  height="2rem"
                  p={0}
                >
                  <Icon icon={pictureIcon} height="2rem" />
                </Button>
              </Tooltip>
            </Box>
          )}
        </Box>
        <GraphicRollHistory rolls={state.rolls} />
        <BetaWarningModal />
        <UserSetupModal
          storedUsername={storedUsername}
          setStoredUsername={setStoredUsername}
          onDone={() => {
            socket?.emit('register-user', storedUsername);
          }}
        />
        <FsLightbox
          toggler={lighthouseToggler}
          sources={state.imgs.map(({ url }) => url)}
          key={state.imgs}
          type="image"
        />
      </Flex>
    </ThemeProvider>
  );
}
interface DieProps extends GraphicDie {
  roll: ({ id: string }) => void;
  rollVersion: number;
  onSelect: (id: string) => void;
  selected: boolean;
  theme: { colors: { [index: string]: string } };
}

function D4Die({
  id,
  curNumber,
  roll,
  rollVersion,
  onSelect,
  selected,
  bgColor,
  theme,
}: DieProps) {
  const el = React.useRef();
  React.useEffect(() => {
    gsap.from(el.current, {
      duration: 1.25,
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <button
      id={id}
      key={id}
      data-selected={selected}
      className={styles.die}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
    >
      <div ref={el} style={{ paddingLeft: '2px' }}>
        <Icon icon={shapeTriangle} height="5rem" color={bgColor} />
      </div>
      <div style={{ position: 'absolute', left: '40%', top: '50%' }}>
        <Icon
          icon={getNumberIcon(curNumber)}
          // @ts-ignore
          color={theme.colors.text}
        />
      </div>
    </button>
  );
}
function D6Die({
  id,
  curNumber,
  roll,
  rollVersion,
  onSelect,
  selected,
  bgColor,
  theme,
}: DieProps) {
  const el = React.useRef();
  React.useEffect(() => {
    gsap.from(el.current, {
      duration: 1.25,
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <button
      id={id}
      key={id}
      data-selected={selected}
      className={styles.die}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
    >
      <div ref={el} style={{ paddingLeft: '2px' }}>
        <Icon icon={shapeSquare} height="5rem" color={bgColor} />
      </div>
      <div style={{ position: 'absolute', left: '42%', top: '42%' }}>
        <Icon
          icon={getNumberIcon(curNumber)}
          // @ts-ignore
          color={theme.colors.text}
        />
      </div>
    </button>
  );
}
function D8Die({
  id,
  curNumber,
  roll,
  rollVersion,
  onSelect,
  selected,
  bgColor,
  theme,
}: DieProps) {
  const el = React.useRef();
  React.useEffect(() => {
    gsap.from(el.current, {
      duration: 1.25,
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <button
      id={id}
      key={id}
      data-selected={selected}
      className={styles.die}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
    >
      <div ref={el} style={{ paddingLeft: '2px' }}>
        <Icon icon={shapeRhombus} height="5rem" color={bgColor} />
      </div>
      <div style={{ position: 'absolute', left: '40%', top: '35%' }}>
        <Icon
          icon={getNumberIcon(curNumber)}
          // @ts-ignore
          color={theme.colors.text}
        />
      </div>
      <Text fontSize={1} color="text">
        D8
      </Text>
    </button>
  );
}
function D10Die({
  id,
  curNumber,
  roll,
  rollVersion,
  onSelect,
  selected,
  bgColor,
  theme,
}: DieProps) {
  const el = React.useRef();
  React.useEffect(() => {
    gsap.from(el.current, {
      duration: 1.25,
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <button
      id={id}
      key={id}
      data-selected={selected}
      className={styles.die}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
    >
      <div ref={el} style={{ paddingLeft: '2px' }}>
        <Icon icon={shapeRhombus} height="5rem" color={bgColor} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: String(curNumber).length > 1 ? '33%' : '40%',
          top: '35%',
        }}
      >
        {String(curNumber)
          .split('')
          .map((n, i) => (
            <Icon
              key={`${id}-${n}`}
              icon={getNumberIcon(parseInt(n, 10))}
              style={{ marginLeft: i === 1 ? '-5px' : '' }}
              // @ts-ignore
              color={theme.colors.text}
            />
          ))}
      </div>
      <Text fontSize={1} color="text">
        D10
      </Text>
    </button>
  );
}
function D12Die({
  id,
  curNumber,
  roll,
  rollVersion,
  onSelect,
  selected,
  bgColor,
  theme,
}: DieProps) {
  const el = React.useRef();
  React.useEffect(() => {
    gsap.from(el.current, {
      duration: 1.25,
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <button
      id={id}
      key={id}
      data-selected={selected}
      className={styles.die}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
    >
      <div ref={el} style={{ paddingLeft: '3px' }}>
        <Icon icon={shapeHexagon} height="5rem" color={bgColor} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: String(curNumber).length > 1 ? '34%' : '40%',
          top: '40%',
        }}
      >
        {String(curNumber)
          .split('')
          .map((n, i) => (
            <Icon
              key={`${id}-${i}`}
              icon={getNumberIcon(parseInt(n, 10))}
              style={{ marginLeft: i === 1 ? '-5px' : '' }}
              // @ts-ignore
              color={theme.colors.text}
            />
          ))}
      </div>
    </button>
  );
}
function D20Die({
  id,
  curNumber,
  roll,
  rollVersion,
  onSelect,
  selected,
  bgColor,
  theme,
}: DieProps) {
  const el = React.useRef();
  React.useEffect(() => {
    gsap.from(el.current, {
      duration: 1.25,
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <button
      id={id}
      key={id}
      data-selected={selected}
      className={styles.die}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
    >
      <div ref={el} style={{ paddingLeft: '2px' }}>
        <Icon icon={shapeOctagon} height="5rem" color={bgColor} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: String(curNumber).length > 1 ? '34%' : '40%',
          top: '40%',
        }}
      >
        {String(curNumber)
          .split('')
          .map((n, i) => (
            <Icon
              key={`${id}-${i}`}
              icon={getNumberIcon(parseInt(n, 10))}
              style={{ marginLeft: i === 1 ? '-5px' : '' }}
              // @ts-ignore
              color={theme.colors.text}
            />
          ))}
      </div>
    </button>
  );
}
function DXDie({
  id,
  curNumber,
  roll,
  rollVersion,
  sides,
  onSelect,
  selected,
  bgColor,
  theme,
}: DieProps) {
  const el = React.useRef();
  React.useEffect(() => {
    gsap.from(el.current, {
      duration: 1.25,
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <button
      id={id}
      key={id}
      data-selected={selected}
      className={styles.die}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
    >
      <div ref={el} style={{ paddingLeft: '2px' }}>
        <Icon icon={decagramOutline} height="5rem" color={bgColor} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: String(curNumber).length > 1 ? '37%' : '43%',
          top: '35%',
        }}
      >
        {String(curNumber)
          .split('')
          .map((n, i) => (
            <Icon
              key={`${id}-${i}`}
              icon={getNumberIcon(parseInt(n, 10))}
              style={{ marginLeft: i === 1 ? '-5px' : '' }}
              // @ts-ignore
              color={theme.colors.text}
            />
          ))}
      </div>
      <Text fontSize={1}>D{sides}</Text>
    </button>
  );
}

interface ClockProps extends Clock {
  socket: SocketIOClient.Socket;
  selected: boolean;
  onSelect: (id: string) => void;
  theme: { colors: { [index: string]: string } };
}
function ClockPie({
  id,
  name,
  onSelect,
  curSegment,
  segments,
  selected,
  socket,
  theme,
}: ClockProps) {
  const el = React.useRef();
  const time = (curSegment / segments) * 100;
  React.useEffect(() => {
    gsap.to(el.current, {
      duration: 0.25,
      strokeDasharray: `${time} 100`,
    });
  }, [time]);
  return (
    <Flex
      width="5rem"
      id={id}
      flexDirection="column"
      alignItems="center"
      m={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      sx={{
        border: selected
          ? `1px solid ${theme.colors.special}`
          : '1px solid transparent',
        boxShadow: selected ? `0 0px 15px ${theme.colors.special}` : 'none',
      }}
    >
      <Text fontSize={1} color="text">
        {name}
      </Text>
      <svg
        viewBox="0 0 32 32"
        style={{
          background: 'transparent',
          borderRadius: '50%',
          transform: 'rotate(-90deg)',
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          socket.emit('advance-clock', { id });
        }}
      >
        <circle
          ref={el}
          fill="#44ffd2"
          stroke="#F26DF9"
          strokeWidth={32}
          strokeDasharray={`${time} 100`}
          r="16"
          cx="16"
          cy="16"
        />
      </svg>
      <Flex justifyContent="space-around" alignItems="center">
        <Button
          variant="ghost"
          p={1}
          sx={{ border: 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            socket.emit('rewind-clock', { id });
          }}
        >
          <Icon icon={arrowLeft} width="2rem" />
        </Button>
        <Button
          variant="ghost"
          p={1}
          sx={{ border: 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            socket.emit('advance-clock', { id });
          }}
        >
          <Icon icon={arrowRight} width="2rem" />
        </Button>
      </Flex>
    </Flex>
  );
}
