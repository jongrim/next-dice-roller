import * as React from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Box, Button, Flex, Text } from 'rebass';
import { ThemeProvider } from 'emotion-theming';
import { TweenMax, Elastic } from 'gsap';
import FsLightbox from 'fslightbox-react';

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
import refreshIcon from '@iconify/icons-mdi-light/refresh';
import deleteIcon from '@iconify/icons-mdi-light/delete';
import pictureIcon from '@iconify/icons-mdi-light/picture';

import Navbar from '../../components/Navbar';
import UserSetupModal from '../../components/UserSetupModal';
import RollBubbleManager from '../../components/RollBubbleManager';
import RollHistory from '../../components/RollHistory';
import DiceSidebar from './DiceSidebar';

import { GraphicDie } from '../../types/dice';
import useTheme from '../../hooks/useTheme';
import _Draggable from 'gsap/Draggable';
import { Icon } from '@iconify/react';
import { Clock } from '../../types/clock';

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

export type Img = { id: string; url: string };

interface GraphicDiceResultsState {
  state: string;
  dice: GraphicDie[];
  clocks: Clock[];
  imgs: Img[];
  roller: string;
}

const diceInitialResultsState: GraphicDiceResultsState = {
  state: diceStates.waiting,
  dice: [],
  clocks: [],
  imgs: [],
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
      type: 'roll';
      payload: { id: string; randNumbers: number[]; roller: string };
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
    case 'remove-item':
      return {
        ...state,
        dice: state.dice.filter(({ id }) => id !== event.payload.id),
        clocks: state.clocks.filter(({ id }) => id !== event.payload.id),
      };
    case 'add-clock':
      return {
        ...state,
        clocks: state.clocks.concat(event.payload.clock),
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
      console.log(event.payload.id);
      return {
        ...state,
        imgs: state.imgs.filter(({ id }) => id !== event.payload.id),
      };
    case 'roll':
      const newDice = state.dice.map((die) => {
        if (die.id === event.payload.id) {
          return {
            ...die,
            curNumber: (event.payload.randNumbers[0] % die.sides) + 1,
            rollVersion: die.rollVersion + 1,
          };
        }
        return die;
      });
      return { ...state, state: diceStates.finished, dice: newDice };
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
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [lighthouseToggler, toggleLighthouse] = React.useState(false);
  const [gsap, setGsap] = React.useState({});
  const [{ Draggable }, setDraggable] = React.useState<{
    Draggable: typeof _Draggable;
  }>({ Draggable: undefined });
  const { theme, toggleTheme } = useTheme();

  const roll = ({ id }) => {
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
        socket.emit('roll', { id, nums });
      });
  };

  const addToSelected = (id: string) => {
    setSelectedItems((cur) => [...cur, id]);
  };
  const removeFromSelected = (id: string) => {
    setSelectedItems((cur) => cur.filter((i) => i !== id));
  };
  const onSelect = (id: string) => {
    selectedItems.includes(id) ? removeFromSelected(id) : addToSelected(id);
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
      ioSocket.on('roll', ({ id, nums }) => {
        /**
         * Note: every socket receives this, including the person that emitted it
         */
        dispatch({
          type: 'roll',
          payload: {
            id,
            randNumbers: nums.data,
            roller: storedUsername,
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
      ioSocket.on('remove-clock', ({ id }) =>
        dispatch({ type: 'remove-clock', payload: { id } })
      );
      ioSocket.on('add-img', ({ img }) => {
        dispatch({ type: 'add-img', payload: { img } });
      });
      ioSocket.on('remove-img', ({ id }) => {
        dispatch({ type: 'remove-img', payload: { id } });
      });
      return () => {
        ioSocket.close();
      };
    }
  }, [name]);

  // Draggable dice
  React.useEffect(() => {
    async function load() {
      const { gsap: g, Draggable: D } = await import('gsap/all');
      setGsap(g);
      setDraggable({ Draggable: D });
    }
    load();
  }, []);

  React.useEffect(() => {
    if (gsap && Draggable) {
      // @ts-ignore
      gsap.registerPlugin(Draggable);
    }
  }, [gsap, Draggable]);

  React.useEffect(() => {
    if (Draggable) {
      Draggable.create(
        state.dice.map(({ id }) => `#${id}`),
        {
          type: 'x,y',
          bounds: document.getElementById('dicebox'),
          zIndex: 1,
          onDrag: function () {
            selectedItems.forEach((id) => {
              if (id === this.target.id) return;
              TweenMax.to(document.getElementById(id), 0.25, {
                x: this.x,
                y: this.y,
              });
            });
          },
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
            } else {
              socket.emit('drag', {
                dragEvent: {
                  id: this.target.id,
                  left: this.endX,
                  top: this.endY,
                },
              });
            }
          },
        }
      );
    }
  }, [Draggable, state.dice, selectedItems]);

  // Draggable clocks
  React.useEffect(() => {
    if (Draggable) {
      Draggable.create(
        state.clocks.map(({ name }) => `#${name}`),
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
    }
  }, [Draggable, state.clocks]);

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
        <DiceSidebar
          addDie={(die: GraphicDie) => socket?.emit('add-g-die', { die })}
          addClock={(clock) => socket?.emit('add-clock', { clock })}
          addImg={(img) => socket?.emit('add-img', { img })}
          removeImg={(id) => socket.emit('remove-img', { id })}
          imgs={state.imgs}
        />
        <Box
          id="dicebox"
          width="100%"
          onClick={() => {
            setSelectedItems([]);
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
            />
          ))}
          {selectedItems.length > 0 && (
            <Flex
              sx={{ position: 'absolute', bottom: '3rem' }}
              width="100%"
              justifyContent="center"
            >
              <Button
                onClick={() => {
                  selectedItems.forEach((id) => {
                    roll({ id });
                  });
                }}
                variant="ghost"
                mr={2}
              >
                <Icon icon={refreshIcon} height="3rem" />
              </Button>
              <Button
                onClick={() => {
                  socket.emit('remove-items', { items: selectedItems });
                }}
                variant="ghost"
                ml={2}
              >
                <Icon icon={deleteIcon} height="3rem" />
              </Button>
            </Flex>
          )}
          {state.imgs.length > 0 && (
            <Button
              sx={{
                position: 'absolute',
                right: '3rem',
                top: '50%',
                border: 'none',
              }}
              onClick={() => {
                toggleLighthouse(!lighthouseToggler);
              }}
              variant="ghost"
              ml={2}
            >
              <Icon icon={pictureIcon} height="2rem" />
            </Button>
          )}
        </Box>
        {/* <Box as="main" flex="1" minHeight="0" maxWidth="1280px" bg="background">
          <RollHistory rolls={state.rolls} />
        </Box> */}
        {/* <RollBubbleManager rolls={state.rolls} /> */}

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
          key={state.imgs.length}
          type="image"
        />
      </Flex>
    </ThemeProvider>
  );
}

function D4Die({ id, curNumber, roll, rollVersion, onSelect, selected }) {
  const el = React.useRef();
  React.useEffect(() => {
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      m={0}
      id={id}
      key={id}
      sx={(style) => ({
        display: 'inline-grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: selected
          ? `1px solid ${style.colors.special}`
          : '1px solid transparent',
        boxShadow: selected ? `0 0px 15px ${style.colors.special}` : 'none',
        position: 'relative',
      })}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
      variant="ghost"
      p={0}
    >
      <Box ref={el} style={{ gridArea: '1 / 1', paddingLeft: '2px' }}>
        <Icon icon={shapeTriangle} height="5rem" />
      </Box>
      <Box style={{ gridArea: '1 / 1' }} pt={3}>
        <Icon icon={getNumberIcon(curNumber)} />
      </Box>
    </Button>
  );
}
function D6Die({ id, curNumber, roll, rollVersion, onSelect, selected }) {
  const el = React.useRef();
  React.useEffect(() => {
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      m={0}
      id={id}
      key={id}
      sx={(style) => ({
        display: 'inline-grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: selected
          ? `1px solid ${style.colors.special}`
          : '1px solid transparent',
        boxShadow: selected ? `0 0px 15px ${style.colors.special}` : 'none',
        position: 'relative',
      })}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
      variant="ghost"
      p={0}
    >
      <Box ref={el} style={{ gridArea: '1 / 1', paddingLeft: '2px' }}>
        <Icon icon={shapeSquare} height="5rem" />
      </Box>
      <Box style={{ gridArea: '1 / 1' }} pt={1}>
        <Icon icon={getNumberIcon(curNumber)} />
      </Box>
    </Button>
  );
}
function D8Die({ id, curNumber, roll, rollVersion, onSelect, selected }) {
  const el = React.useRef();
  React.useEffect(() => {
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      m={0}
      id={id}
      key={id}
      sx={(style) => ({
        display: 'inline-grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: selected
          ? `1px solid ${style.colors.special}`
          : '1px solid transparent',
        boxShadow: selected ? `0 0px 15px ${style.colors.special}` : 'none',
        position: 'relative',
      })}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
      variant="ghost"
      p={0}
    >
      <Box ref={el} style={{ gridArea: '1 / 1', paddingLeft: '2px' }}>
        <Icon icon={shapeRhombus} height="5rem" />
      </Box>
      <Box style={{ gridArea: '1 / 1' }} pt={1} pl="-5px">
        <Icon icon={getNumberIcon(curNumber)} />
      </Box>
      <Text fontSize={1}>D8</Text>
    </Button>
  );
}
function D10Die({ id, curNumber, roll, rollVersion, onSelect, selected }) {
  const el = React.useRef();
  React.useEffect(() => {
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      m={0}
      id={id}
      key={id}
      sx={(style) => ({
        display: 'inline-grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: selected
          ? `1px solid ${style.colors.special}`
          : '1px solid transparent',
        boxShadow: selected ? `0 0px 15px ${style.colors.special}` : 'none',
        position: 'relative',
      })}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
      variant="ghost"
      p={0}
    >
      <Box ref={el} style={{ gridArea: '1 / 1', paddingLeft: '2px' }}>
        <Icon icon={shapeRhombus} height="5rem" />
      </Box>
      <Box style={{ gridArea: '1 / 1' }} pt={1}>
        {String(curNumber)
          .split('')
          .map((n, i) => (
            <Icon
              key={`${id}-${n}`}
              icon={getNumberIcon(parseInt(n, 10))}
              style={{ marginLeft: i === 1 ? '-5px' : '' }}
            />
          ))}
      </Box>
      <Text fontSize={1}>D10</Text>
    </Button>
  );
}
function D12Die({ id, curNumber, roll, rollVersion, onSelect, selected }) {
  const el = React.useRef();
  React.useEffect(() => {
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      m={0}
      id={id}
      key={id}
      sx={(style) => ({
        display: 'inline-grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: selected
          ? `1px solid ${style.colors.special}`
          : '1px solid transparent',
        boxShadow: selected ? `0 0px 15px ${style.colors.special}` : 'none',
        position: 'relative',
      })}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
      variant="ghost"
      p={0}
    >
      <Box ref={el} style={{ gridArea: '1 / 1', paddingLeft: '3px' }}>
        <Icon icon={shapeHexagon} height="5rem" />
      </Box>
      <Box style={{ gridArea: '1 / 1' }} pt={1} pl="-5px">
        {String(curNumber)
          .split('')
          .map((n, i) => (
            <Icon
              key={`${id}-${n}`}
              icon={getNumberIcon(parseInt(n, 10))}
              style={{ marginLeft: i === 1 ? '-5px' : '' }}
            />
          ))}
      </Box>
    </Button>
  );
}
function D20Die({ id, curNumber, roll, rollVersion, onSelect, selected }) {
  const el = React.useRef();
  React.useEffect(() => {
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      m={0}
      id={id}
      key={id}
      sx={(style) => ({
        display: 'inline-grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: selected
          ? `1px solid ${style.colors.special}`
          : '1px solid transparent',
        boxShadow: selected ? `0 0px 15px ${style.colors.special}` : 'none',
        position: 'relative',
      })}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onDoubleClick={(e) => roll({ id })}
      variant="ghost"
      p={0}
    >
      <Box ref={el} style={{ gridArea: '1 / 1', paddingLeft: '2px' }}>
        <Icon icon={shapeOctagon} height="5rem" />
      </Box>
      <Box style={{ gridArea: '1 / 1' }} pt={1}>
        {String(curNumber)
          .split('')
          .map((n, i) => (
            <Icon
              key={`${id}-${n}`}
              icon={getNumberIcon(parseInt(n, 10))}
              style={{ marginLeft: i === 1 ? '-5px' : '' }}
            />
          ))}
      </Box>
    </Button>
  );
}

interface ClockProps extends Clock {
  socket: SocketIOClient.Socket;
  selected: boolean;
  onSelect: (id: string) => void;
}
const ClockPie: React.FC<ClockProps> = ({
  id,
  name,
  onSelect,
  segments,
  selected,
  socket,
}) => {
  const el = React.useRef();
  const [segment, tick] = React.useState(0);
  const handleAdvance = () => {
    tick((cur) => cur + 1);
  };
  const time = (segment / segments) * 100;
  React.useEffect(() => {
    TweenMax.to(el.current, 0.25, {
      strokeDasharray: `${time} 100`,
    });
  }, [time]);
  React.useEffect(() => {
    socket.on('advance', ({ clockName }) => {
      if (clockName === name) {
        handleAdvance();
      }
    });
  }, [socket]);
  return (
    <Flex
      width="5rem"
      id={name}
      flexDirection="column"
      alignItems="center"
      m={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      sx={(style) => ({
        border: selected
          ? `1px solid ${style.colors.special}`
          : '1px solid transparent',
        boxShadow: selected ? `0 0px 15px ${style.colors.special}` : 'none',
      })}
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
          socket.emit('advance', { clockName: name });
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
    </Flex>
  );
};
