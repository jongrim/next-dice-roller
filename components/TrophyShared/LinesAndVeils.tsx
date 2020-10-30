import * as React from 'react';
import { Box, Button, Text } from 'rebass';
import { Radio as RebassRadio, Label, Input } from '@rebass/forms';
import { CLIENT_ID } from '../../pages/trophy-dark/[name]';

const debounce = (cb, timeout: number) => {
  let minTime: number;
  let updatedArgs;
  return function callInFuture(...args) {
    minTime = Date.now() + timeout;
    updatedArgs = args;
    setTimeout(() => {
      if (Date.now() >= minTime) {
        cb(...updatedArgs);
      }
    }, timeout);
  };
};

const itemFactory = (label: string): Item => ({ label, id: label });

const Radio = (props) => (
  <RebassRadio
    {...props}
    sx={Object.assign(
      {
        'input:disabled ~ &': {
          color: 'text',
        },
        'input:checked ~ &': {
          color: 'text',
        },
      },
      props.sx
    )}
  />
);

type classification = 'line' | 'veil' | 'ask' | 'consent';

interface Item {
  id: string;
  label: string;
  classification?: classification;
}

interface LinesAndVeils {
  items: Record<string, Item>;
  socket?: SocketIOClient.Socket;
}

type linesAndVeilsEvents =
  | {
      type: 'addItem';
      payload: { item: Item };
    }
  | {
      type: 'updateClassification';
      payload: { id: string; classification: classification };
    }
  | {
      type: 'addSocket';
      payload: { socket: SocketIOClient.Socket };
    }
  | {
      type: 'emitLinesAndVeilsSync';
    }
  | {
      type: 'sync';
      payload: { items: Record<string, Item> };
    };

const linesAndVeilsReducer = (
  state: LinesAndVeils,
  event: linesAndVeilsEvents
): LinesAndVeils => {
  switch (event.type) {
    case 'addItem':
      return {
        socket: state.socket,
        items: {
          ...state.items,
          [event.payload.item.label]: itemFactory(event.payload.item.label),
        },
      };
    case 'updateClassification':
      return {
        socket: state.socket,
        items: {
          ...state.items,
          [event.payload.id]: {
            ...state.items[event.payload.id],
            classification: event.payload.classification,
          },
        },
      };
    case 'addSocket':
      return {
        ...state,
        socket: event.payload.socket,
      };
    case 'emitLinesAndVeilsSync':
      state.socket.emit('syncLinesAndVeils', {
        clientId: CLIENT_ID,
        items: state.items,
      });
      return state;
    case 'sync':
      return {
        ...state,
        items: event.payload.items,
      };
    default:
      return state;
  }
};

const initialLinesAndVeils: LinesAndVeils = {
  items: [
    'Alcoholism',
    'Bullying',
    'Childhood Abandonment',
    'Classism',
    'Drug Abuse',
    'Eye Injuries',
    'Graphic Gore',
    'Harm to Animals',
    'Harm to Children',
    'Racism',
    'Sexual Assault',
    'Human Sexuality',
    'Slavery',
    'Spiders',
    'Starvation',
    'Suicide',
    'Torture',
    'Homophobia',
    'Kissing',
    'Kink',
    'Lonileness',
    'Covid-19 / pandemics',
    "Celebrating others' misery",
    'Bystanders seriously hurt',
  ].reduce((acc, cur) => {
    const item = itemFactory(cur);
    return {
      ...acc,
      [cur]: item,
    };
  }, {}),
};

export default function LinesAndVeils({
  socket,
}: {
  socket: SocketIOClient.Socket;
}): React.ReactElement {
  const [state, dispatch] = React.useReducer(
    linesAndVeilsReducer,
    initialLinesAndVeils
  );
  const [newItemLabel, setNewItemLabel] = React.useState('');
  React.useEffect(() => {
    if (socket) {
      dispatch({ type: 'addSocket', payload: { socket } });
      socket.on('addItem', (event) => {
        if (event.clientId !== CLIENT_ID) {
          dispatch(event);
        }
      });
      socket.on('updateClassification', (event) => {
        if (event.clientId !== CLIENT_ID) {
          dispatch(event);
        }
      });
      socket.on('request-sync', ({ clientId }) => {
        if (clientId !== CLIENT_ID) {
          dispatch({ type: 'emitLinesAndVeilsSync' });
        }
      });
      socket.on('syncLinesAndVeils', ({ clientId, items }) => {
        if (clientId !== CLIENT_ID) {
          dispatch({ type: 'sync', payload: { items } });
        }
      });
    }
  }, [socket]);

  return (
    <Box
      px={4}
      pb={4}
      sx={{
        display: 'grid',
        gridTemplate: '70px 1fr / 200px 100px 100px 100px 100px 1fr',
        justifyItems: 'center',
        alignItems: 'center',
      }}
    >
      <Box />
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Line
      </Text>
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Veil
      </Text>
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Ask First
      </Text>
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Enthusiastic Consent
      </Text>
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Notes
      </Text>
      {Object.values(state.items).map((item) => (
        <React.Fragment key={item.id}>
          <Label htmlFor={item.label} variant="text.label">
            {item.label}
          </Label>
          <Label
            width="25px"
            height="25px"
            sx={{ cursor: 'pointer' }}
            aria-label={`line ${item.label}`}
          >
            <Radio
              checked={item.classification === 'line'}
              id={`${item.label}-line`}
              name={item.label}
              value={`${item.label}-line`}
              onChange={() => {
                socket?.emit('updateClassification', {
                  clientId: CLIENT_ID,
                  type: 'updateClassification',
                  payload: {
                    id: item.id,
                    classification: 'line',
                  },
                });
                dispatch({
                  type: 'updateClassification',
                  payload: { id: item.id, classification: 'line' },
                });
              }}
            />
          </Label>
          <Label
            width="25px"
            height="25px"
            sx={{ cursor: 'pointer' }}
            aria-label={`veil ${item.label}`}
          >
            <Radio
              checked={item.classification === 'veil'}
              id={`${item.label}-veil`}
              name={item.label}
              value={`${item.label}-veil`}
              onChange={() => {
                socket?.emit('updateClassification', {
                  clientId: CLIENT_ID,
                  type: 'updateClassification',
                  payload: {
                    id: item.id,
                    classification: 'veil',
                  },
                });
                dispatch({
                  type: 'updateClassification',
                  payload: { id: item.id, classification: 'veil' },
                });
              }}
            />
          </Label>
          <Label
            width="25px"
            height="25px"
            sx={{ cursor: 'pointer' }}
            aria-label={`ask ${item.label}`}
          >
            <Radio
              checked={item.classification === 'ask'}
              id={`${item.label}-ask`}
              name={item.label}
              value={`${item.label}-ask`}
              onChange={() => {
                socket?.emit('updateClassification', {
                  clientId: CLIENT_ID,
                  type: 'updateClassification',
                  payload: {
                    id: item.id,
                    classification: 'ask',
                  },
                });
                dispatch({
                  type: 'updateClassification',
                  payload: { id: item.id, classification: 'ask' },
                });
              }}
            />
          </Label>
          <Label
            width="25px"
            height="25px"
            sx={{ cursor: 'pointer' }}
            aria-label={`consent ${item.label}`}
          >
            <Radio
              checked={item.classification === 'consent'}
              id={`${item.label}-consent`}
              name={item.label}
              value={`${item.label}-consent`}
              onChange={() => {
                socket?.emit('updateClassification', {
                  clientId: CLIENT_ID,
                  type: 'updateClassification',
                  payload: {
                    id: item.id,
                    classification: 'consent',
                  },
                });
                dispatch({
                  type: 'updateClassification',
                  payload: { id: item.id, classification: 'consent' },
                });
              }}
            />
          </Label>
          <NoteField label={item.id} socket={socket} />
        </React.Fragment>
      ))}
      <Input
        mt={3}
        width="95%"
        id="new-item-label"
        name="new-item-label"
        sx={(styles) => ({
          gridColumn: '1 / 6',
          border: 'none',
          borderBottom: `1px solid ${styles.colors.text}`,
          justifySelf: 'start',
        })}
        variant="text.p"
        value={newItemLabel}
        onChange={({ target }) => setNewItemLabel(target.value)}
      />
      <Button
        mt={3}
        variant="ghost"
        width="100%"
        sx={{
          gridColumn: '6 / 6',
        }}
        onClick={() => {
          socket?.emit('addItem', {
            clientId: CLIENT_ID,
            type: 'addItem',
            payload: { item: itemFactory(newItemLabel) },
          });
          dispatch({
            type: 'addItem',
            payload: { item: itemFactory(newItemLabel) },
          });
          setNewItemLabel('');
        }}
      >
        Add New
      </Button>
    </Box>
  );
}

interface NoteFieldState {
  value: string;
  socket?: SocketIOClient.Socket;
}

type NoteFieldEvents =
  | {
      type: 'update';
      payload: {
        value: string;
      };
    }
  | {
      type: 'emit';
      payload: {
        label: string;
      };
    }
  | {
      type: 'addSocket';
      payload: {
        socket: SocketIOClient.Socket;
      };
    };

const valueReducer = (state: NoteFieldState, event: NoteFieldEvents) => {
  switch (event.type) {
    case 'addSocket':
      return {
        ...state,
        socket: event.payload.socket,
      };
    case 'update':
      return {
        ...state,
        value: event.payload.value,
      };
    case 'emit':
      state.socket?.emit('update-note', {
        clientId: CLIENT_ID,
        noteLabel: event.payload.label,
        value: state.value,
      });
      return state;
  }
};

const NoteField = ({
  label,
  socket,
}: {
  label: string;
  socket: SocketIOClient.Socket;
}): React.ReactElement => {
  const [state, dispatch] = React.useReducer(valueReducer, { value: '' });
  const emitNoteChange = React.useCallback(
    debounce((value) => {
      socket?.emit('update-note', {
        clientId: CLIENT_ID,
        noteLabel: label,
        value,
      });
    }, 2500),
    [socket, label]
  );

  React.useEffect(() => {
    if (socket) {
      dispatch({ type: 'addSocket', payload: { socket } });
      socket.on('update-note', ({ clientId, noteLabel, value }) => {
        if (clientId !== CLIENT_ID) {
          if (noteLabel === label) {
            dispatch({ type: 'update', payload: { value } });
          }
        }
      });
      socket.on('request-sync', ({ clientId }) => {
        if (clientId !== CLIENT_ID) {
          dispatch({ type: 'emit', payload: { label } });
        }
      });
    }
  }, [socket, label]);
  return (
    <Input
      id={`${label}-note`}
      name={`${label}-note`}
      value={state.value}
      variant="text.p"
      sx={(styles) => ({
        border: 'none',
        borderBottom: `1px solid ${styles.colors.text}`,
      })}
      onChange={({ target: { value } }) => {
        dispatch({ type: 'update', payload: { value } });
        emitNoteChange(value);
      }}
    />
  );
};
