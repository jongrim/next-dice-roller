import * as React from 'react';
import { Box, Image, Flex, Text, Button } from 'rebass';
import { Label, Input, Textarea } from '@rebass/forms';
import { Icon } from '@iconify/react';
import cameraPlusOutline from '@iconify/icons-mdi/camera-plus-outline';
import { useTheme } from 'emotion-theming';
import NewImgModal from './NewImgModal';

interface CharacterCardState {
  imageSrc?: string;
  socket?: SocketIOClient.Socket;
  name: string;
  pronouns: string;
  occupation: string;
  background: string;
  ritual1?: string;
  ritual2?: string;
  ritual3?: string;
  drive: string;
  baseRuin: number;
  ruin: number;
}

type characterCardEvent =
  | {
      type: 'setField';
      payload: {
        field:
          | 'imageSrc'
          | 'name'
          | 'pronouns'
          | 'occupation'
          | 'background'
          | 'ritual1'
          | 'ritual2'
          | 'ritual3'
          | 'drive';
        value: string;
      };
    }
  | {
      type: 'setSocket';
      payload: {
        socket: SocketIOClient.Socket;
      };
    }
  | {
      type: 'emitUpdate';
    }
  | {
      type: 'increaseRuin';
      payload: { value: number };
    }
  | {
      type: 'decreaseRuin';
      payload: { value: number };
    };

const characterCardReducer = (
  state: CharacterCardState,
  event: characterCardEvent
): CharacterCardState => {
  switch (event.type) {
    case 'setSocket':
      return {
        ...state,
        socket: event.payload.socket,
      };
    case 'emitUpdate':
      state.socket.emit('character-update', {
        imageSrc: state.imageSrc,
        name: state.name,
        pronouns: state.pronouns,
        occupation: state.occupation,
        background: state.background,
        ritual1: state.ritual1,
        ritual2: state.ritual2,
        ritual3: state.ritual3,
        drive: state.drive,
        baseRuin: state.baseRuin,
        ruin: state.ruin,
      });
      return state;
    case 'setField':
      const nextState = {
        ...state,
        [event.payload.field]: event.payload.value,
      };
      let newBaseRuin = 1;
      if (nextState.ritual1) newBaseRuin++;
      if (nextState.ritual2) newBaseRuin++;
      if (nextState.ritual3) newBaseRuin++;
      nextState.baseRuin = newBaseRuin;
      if (nextState.ruin < newBaseRuin) {
        nextState.ruin = newBaseRuin;
      }
      return nextState;
    case 'increaseRuin':
      const increasedRuinState = {
        ...state,
        ruin: event.payload.value,
      };
      state.socket.emit('character-update', {
        imageSrc: increasedRuinState.imageSrc,
        name: increasedRuinState.name,
        pronouns: increasedRuinState.pronouns,
        occupation: increasedRuinState.occupation,
        background: increasedRuinState.background,
        ritual1: increasedRuinState.ritual1,
        ritual2: increasedRuinState.ritual2,
        ritual3: increasedRuinState.ritual3,
        drive: increasedRuinState.drive,
        baseRuin: state.baseRuin,
        ruin: increasedRuinState.ruin,
      });
      return increasedRuinState;
    case 'decreaseRuin':
      const decreasedRuinState = {
        ...state,
        ruin:
          event.payload.value >= state.baseRuin
            ? event.payload.value
            : state.baseRuin,
      };
      state.socket.emit('character-update', {
        imageSrc: decreasedRuinState.imageSrc,
        name: decreasedRuinState.name,
        pronouns: decreasedRuinState.pronouns,
        occupation: decreasedRuinState.occupation,
        background: decreasedRuinState.background,
        ritual1: decreasedRuinState.ritual1,
        ritual2: decreasedRuinState.ritual2,
        ritual3: decreasedRuinState.ritual3,
        drive: decreasedRuinState.drive,
        baseRuin: decreasedRuinState.baseRuin,
        ruin: decreasedRuinState.ruin,
      });
      return decreasedRuinState;
    default:
      return state;
  }
};

const initialState: CharacterCardState = {
  imageSrc: '',
  name: '',
  pronouns: '',
  occupation: '',
  background: '',
  ritual1: '',
  ritual2: '',
  ritual3: '',
  drive: '',
  baseRuin: 1,
  ruin: 1,
};

export default function CharacterCard({
  socket,
}: {
  socket: SocketIOClient.Socket;
}): React.ReactElement {
  const theme = useTheme();
  const [state, dispatch] = React.useReducer(
    characterCardReducer,
    initialState
  );
  const [showNewImgModal, setShowNewImgInput] = React.useState(false);

  React.useEffect(() => {
    if (socket) {
      dispatch({ type: 'setSocket', payload: { socket } });
    }
  }, [socket]);

  React.useEffect(() => {
    const debounce = (cb, timeout: number) => {
      let minTime: number;
      let updatedArgs;
      return function callInFuture(...args) {
        minTime = Date.now() + timeout;
        updatedArgs = args;
        setTimeout(() => {
          if (Date.now() >= minTime) {
            cb(updatedArgs);
          }
        }, timeout);
      };
    };

    const cb = debounce(() => dispatch({ type: 'emitUpdate' }), 3000);
    document.addEventListener('keydown', cb);
    return () => document.removeEventListener('keypress', cb);
  }, []);
  return (
    <Box width="500px">
      <Box
        sx={{
          display: 'grid',
          gridGap: 4,
          gridTemplateColumns: '150px 1fr',
          alignItems: 'end',
        }}
        mb={6}
      >
        {state.imageSrc ? (
          <Button
            p={0}
            variant="clear"
            height="100%"
            width="100%"
            onClick={() => setShowNewImgInput(true)}
          >
            <Image
              src={state.imageSrc}
              alt="treasure-hunter"
              variant="avatar"
              width="100%"
            />
          </Button>
        ) : (
          <Flex
            height="150px"
            justifyContent="center"
            alignItems="center"
            sx={(styles) => ({
              border: `4px dashed ${styles.colors.secondaryText}`,
            })}
          >
            <Button
              variant="clear"
              height="100%"
              width="100%"
              onClick={() => setShowNewImgInput(true)}
            >
              <Icon
                icon={cameraPlusOutline}
                height="2.5rem"
                color={theme.colors.text}
              />
            </Button>
          </Flex>
        )}
        <Flex flexDirection="column" alignItems="flex-end">
          <Input
            variant="text.name"
            mb={1}
            value={state.name}
            placeholder="Character name"
            onChange={({ target: { value } }) =>
              dispatch({ type: 'setField', payload: { field: 'name', value } })
            }
          />
          <Input
            variant="text.pronouns"
            mb={3}
            value={state.pronouns}
            placeholder="Character pronouns"
            onChange={({ target: { value } }) =>
              dispatch({
                type: 'setField',
                payload: { field: 'pronouns', value },
              })
            }
          />
          <Box
            sx={{
              display: 'grid',
              gridGap: 2,
              gridTemplateColumns: 'repeat(6, 36px)',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Button
                variant="ghost"
                key={`ruin-${num}`}
                data-value={num}
                color={num <= state.baseRuin ? 'muted' : 'text'}
                sx={(styles) => ({
                  borderColor:
                    num <= state.baseRuin
                      ? styles.colors.muted
                      : styles.colors.text,
                })}
                onClick={({ target }) =>
                  num > state.ruin
                    ? dispatch({
                        type: 'increaseRuin',
                        payload: {
                          value: num,
                        },
                      })
                    : dispatch({
                        type: 'decreaseRuin',
                        payload: {
                          value: num - 1,
                        },
                      })
                }
              >
                {state.ruin >= num && (
                  <RuinDiagonalMarker permanent={num <= state.baseRuin} />
                )}
                {num}
              </Button>
            ))}
          </Box>
        </Flex>
      </Box>
      <Box mb={6}>
        <Label as="label" htmlFor="occupation" variant="text.label">
          Occupation
        </Label>
        <Input
          variant="text.p"
          id="occupation"
          value={state.occupation}
          onChange={({ target: { value } }) =>
            dispatch({
              type: 'setField',
              payload: { field: 'occupation', value },
            })
          }
          px={0}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
          })}
        />
      </Box>
      <Box mb={6}>
        <Label as="label" htmlFor="background" variant="text.label">
          Background
        </Label>
        <Input
          variant="text.p"
          id="background"
          value={state.background}
          onChange={({ target: { value } }) =>
            dispatch({
              type: 'setField',
              payload: { field: 'background', value },
            })
          }
          px={0}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
          })}
        />
      </Box>
      <Box mb={6}>
        <Text variant="text.label">Rituals</Text>
        <Input
          variant="text.p"
          id="ritual-1"
          value={state.ritual1}
          onChange={({ target: { value } }) =>
            dispatch({
              type: 'setField',
              payload: { field: 'ritual1', value },
            })
          }
          px={0}
          mb={1}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
          })}
        />
        <Input
          variant="text.p"
          id="ritual-2"
          value={state.ritual2}
          onChange={({ target: { value } }) =>
            dispatch({
              type: 'setField',
              payload: { field: 'ritual2', value },
            })
          }
          px={0}
          mb={1}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
          })}
        />
        <Input
          variant="text.p"
          id="ritual-3"
          value={state.ritual3}
          onChange={({ target: { value } }) =>
            dispatch({
              type: 'setField',
              payload: { field: 'ritual3', value },
            })
          }
          px={0}
          mb={1}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
          })}
        />
      </Box>
      <Box>
        <Label as="label" variant="text.label">
          Drive
        </Label>
        <Textarea
          id="drive"
          value={state.drive}
          onChange={({ target: { value } }) =>
            dispatch({ type: 'setField', payload: { field: 'drive', value } })
          }
          px={0}
          mb={1}
          variant="text.p"
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
            resize: 'vertical',
          })}
        />
      </Box>
      <NewImgModal
        isOpen={showNewImgModal}
        onDone={(url) => {
          dispatch({
            type: 'setField',
            payload: { field: 'imageSrc', value: url },
          });
          setShowNewImgInput(false);
          dispatch({ type: 'emitUpdate' });
        }}
      />
    </Box>
  );
}

const RuinDiagonalMarker = ({ permanent }: { permanent: boolean }) => {
  return (
    <Box
      height="49.5px"
      width="1px"
      sx={(styles) => ({
        borderRight: `1px solid ${
          permanent ? styles.colors.muted : styles.colors.text
        }`,
        position: 'absolute',
        transform: 'translate(4.5px, -15.5px) rotate(0.125turn)',
      })}
    />
  );
};
