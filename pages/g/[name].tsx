import * as React from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import { Box, Button, Flex, Text } from 'rebass';
import { ThemeProvider } from 'emotion-theming';
import { TweenMax, Elastic } from 'gsap';

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

import Navbar from '../../components/Navbar';
import UserSetupModal from '../../components/UserSetupModal';
import RollBubbleManager from '../../components/RollBubbleManager';
import RollHistory from '../../components/RollHistory';
import DiceSidebar from './DiceSidebar';

import { GraphicDie } from '../../types/dice';
import useTheme from '../../hooks/useTheme';
import _Draggable from 'gsap/Draggable';
import { Icon } from '@iconify/react';

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

interface GraphicDiceResultsState {
  state: string;
  dice: GraphicDie[];
  roller: string;
}

const diceInitialResultsState: GraphicDiceResultsState = {
  state: diceStates.waiting,
  dice: [],
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
      //@ts-ignore
      Draggable.create(
        state.dice.map(({ id }) => `#${id}`),
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
  }, [Draggable, state.dice]);

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
        />
        <Box id="dicebox" width="100%">
          {state.dice.map((d) => {
            switch (d.sides) {
              case 4:
                return <D4Die {...d} roll={roll} />;
              case 6:
                return <D6Die {...d} roll={roll} />;
              case 8:
                return <D8Die {...d} roll={roll} />;
              case 10:
                return <D10Die {...d} roll={roll} />;
              case 12:
                return <D12Die {...d} roll={roll} />;
              case 20:
                return <D20Die {...d} roll={roll} />;
            }
          })}
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
      </Flex>
    </ThemeProvider>
  );
}

function D4Die({ id, curNumber, roll, rollVersion }) {
  const el = React.useRef();
  React.useEffect(() => {
    console.log('run effect');
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      id={id}
      key={id}
      width="3rem"
      height="3rem"
      style={{
        display: 'grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: 'none',
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
function D6Die({ id, curNumber, roll, rollVersion }) {
  const el = React.useRef();
  React.useEffect(() => {
    console.log('run effect');
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      id={id}
      key={id}
      width="3rem"
      height="3rem"
      style={{
        display: 'grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: 'none',
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
function D8Die({ id, curNumber, roll, rollVersion }) {
  const el = React.useRef();
  React.useEffect(() => {
    console.log('run effect');
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      id={id}
      key={id}
      width="3rem"
      height="3rem"
      style={{
        display: 'grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: 'none',
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
function D10Die({ id, curNumber, roll, rollVersion }) {
  const el = React.useRef();
  React.useEffect(() => {
    console.log('run effect');
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      id={id}
      key={id}
      width="3rem"
      height="3rem"
      style={{
        display: 'grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: 'none',
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
function D12Die({ id, curNumber, roll, rollVersion }) {
  const el = React.useRef();
  React.useEffect(() => {
    console.log('run effect');
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      id={id}
      key={id}
      width="3rem"
      height="3rem"
      style={{
        display: 'grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: 'none',
      }}
      onDoubleClick={(e) => roll({ id })}
      variant="ghost"
      p={0}
    >
      <Box ref={el} style={{ gridArea: '1 / 1', paddingLeft: '2px' }}>
        <Icon icon={shapeHexagon} height="5rem" />
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
function D20Die({ id, curNumber, roll, rollVersion }) {
  const el = React.useRef();
  React.useEffect(() => {
    console.log('run effect');
    TweenMax.from(el.current, 1.25, {
      rotation: 360,
      ease: Elastic.easeOut.config(1, 1),
    });
  }, [rollVersion]);
  return (
    <Button
      id={id}
      key={id}
      width="3rem"
      height="3rem"
      style={{
        display: 'grid',
        gridTemplate: '1fr / 1fr',
        justifyItems: 'center',
        alignItems: 'center',
        border: 'none',
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
