import * as React from 'react';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import * as R from 'ramda';
import { TweenLite, Sine } from 'gsap';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';

import Checkbox from '../Checkbox';
import AddRollModal from '../AddRollModal';
import EditRollModal from '../EditRollModal';
import LoadRollsModal from '../LoadRollsModal';
import CreateDieModal from '../CreateDieModal';

import { emitEvent } from '../../utils/goatcounter';
import { diceNeedsSubmission, Die } from '../../types/dice';
import ConfiguredRollListItem from './ConfiguredRollListItem';

export interface configuredRoll {
  rollName: string;
  dice: string[];
  modifier: string;
  id: string;
}

export type rollInfo = {
  name: string;
  modifier: string;
  addToCurrentRoll: boolean;
};
interface DiceSelectionFormProps {
  onSubmit: (needs: diceNeedsSubmission, meta?: rollInfo) => void;
  hasRolls: boolean;
  socket: SocketIOClient.Socket;
}

const initialDiceValues = {
  d2: '',
  d4: '',
  d6: '',
  d8: '',
  d10: '',
  d12: '',
  d20: '',
  d100: '',
};

const DiceSelectionForm: React.FC<DiceSelectionFormProps> = ({
  onSubmit,
  hasRolls,
  socket,
}) => {
  const [storedRollIds, setStoredRollIds] = React.useState<
    configuredRoll['id'][]
  >([]);
  const [addRollIsOpen, setAddRollIsOpen] = React.useState(false);
  const [editRollId, setEditRollId] = React.useState('');
  const [loadRollIsOpen, setLoadRollIsOpen] = React.useState(false);
  const [createDieIsOpen, setCreateDieIsOpen] = React.useState(false);
  const [rolls, setRolls] = React.useState<configuredRoll[]>([]);
  const [customDice, setCustomDice] = React.useState<Die[]>([]);
  const [customDiceValues, setCustomDiceValues] = React.useState<{
    [key: string]: string;
  }>(initialDiceValues);
  const [assortedModifier, setAssortedModifier] = React.useState('');
  const [assortedLabel, setAssortedLabel] = React.useState('');
  const [
    addToCurrentRollIsChecked,
    setAddToCurrentRollIsChecked,
  ] = React.useState(false);

  const updateCustomDiceValue = (name: string) => (value: string) =>
    setCustomDiceValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

  React.useEffect(() => {
    socket?.on('add-die', ({ die }) => {
      /**
       * Note: every socket receives this, including the person that emitted it
       */
      setCustomDice((curDice) => curDice.concat(die));
      addCustomDieToValues(die);
    });
  }, [socket]);

  React.useEffect(() => {
    socket?.on('share-roll', ({ roll }) => {
      /**
       * Note: every socket receives this, including the person that emitted it
       */
      if (rolls.find((r) => r.id === roll.id)) return;
      setRolls((cur) => [...cur, roll]);
    });
    return () => socket?.removeEventListener('share-roll');
  }, [socket, rolls]);

  React.useEffect(() => {
    const localRolls = window.localStorage.getItem('rollIds');
    if (localRolls) {
      setStoredRollIds(JSON.parse(localRolls));
    }
  }, [setStoredRollIds]);

  React.useEffect(() => {
    rolls.forEach((roll) => {
      window.localStorage.setItem(roll.id, JSON.stringify(roll));
    });
    const rollIds = rolls.map(({ id }) => id);
    const localRolls = window.localStorage.getItem('rollIds');
    const rollIdsToSave = localRolls
      ? rollIds.concat(JSON.parse(localRolls))
      : rollIds;
    const uniqueIds = [...new Set(rollIdsToSave)];
    window.localStorage.setItem('rollIds', JSON.stringify(uniqueIds));
    setStoredRollIds(uniqueIds);
  }, [rolls, setStoredRollIds]);

  const handleLoadRolls = (
    e: React.SyntheticEvent,
    loadedRolls?: configuredRoll[]
  ) => {
    e.preventDefault();
    if (loadedRolls) {
      setRolls([...rolls, ...loadedRolls]);
    }
    setLoadRollIsOpen(false);
  };

  const clearDiceForms = () => {
    setCustomDiceValues(
      Object.assign(
        {},
        initialDiceValues,
        Object.keys(customDiceValues).reduce(
          (acc, cur) => ({ ...acc, [cur]: '' }),
          {}
        )
      )
    );
    setAssortedLabel('');
    setAssortedModifier('');
    setAddToCurrentRollIsChecked(false);
  };

  const addCustomDieToValues = (die: Die) => {
    setCustomDiceValues((cur) => ({
      ...cur,
      [die.name]: '',
    }));
  };

  return (
    <Box
      sx={(styles) => ({
        borderTop: [`1px ${styles.colors.text} solid`, 'none', 'none'],
      })}
      mt={[2, 0, 0]}
      pt={[2, 0, 0]}
    >
      <Heading as="h3" color="text" fontWeight="600">
        Your Configured Rolls
      </Heading>
      <Box mt={2}>
        {rolls.length === 0 && storedRollIds.length > 0 && (
          <Box>
            <Text color="text" fontSize={2}>
              You haven&apos;t loaded your rolls. Click load to add them.
            </Text>
          </Box>
        )}
        {rolls.length === 0 && storedRollIds.length === 0 && (
          <Box>
            <Text color="text" fontSize={2}>
              You haven&apos;t created any rolls yet.
            </Text>
            <Text color="text" fontSize={2}>
              Configured rolls can be quickly rolled and saved for reuse in
              future sessions. Click &quot;Create a roll&quot; below to get
              started.
            </Text>
          </Box>
        )}
        {rolls.map((roll) => (
          <ConfiguredRollListItem
            key={roll.id}
            roll={roll}
            rolls={rolls}
            onSubmit={onSubmit}
            setEditRollId={setEditRollId}
            storedRollIds={storedRollIds}
            setStoredRollIds={setStoredRollIds}
            setRolls={setRolls}
            socket={socket}
          />
        ))}
        <Flex justifyContent="space-between" alignItems="center" mt={3}>
          <Button
            width="48%"
            type="button"
            onClick={() => {
              emitEvent({
                path: 'open-add-roll-modal',
                title: 'open add roll modal',
              });
              setAddRollIsOpen(true);
            }}
            variant="secondary"
          >
            Create a Roll
          </Button>
          <Button
            disabled={storedRollIds.length === 0}
            variant="ghost"
            width="48%"
            type="button"
            onClick={() => {
              emitEvent({
                path: 'open-load-rolls-modal',
                title: 'open load rolls modal',
              });
              setLoadRollIsOpen(true);
            }}
          >
            Load Saved Rolls
          </Button>
        </Flex>
      </Box>
      <AddRollModal
        isOpen={addRollIsOpen}
        onDismiss={(e, roll?: configuredRoll) => {
          e.preventDefault();
          if (roll) {
            emitEvent({
              path: 'add-roll',
              title: 'add roll',
            });
            setRolls(rolls.concat([roll]));
          }
          emitEvent({
            path: 'close-roll-modal',
            title: 'close roll modal',
          });
          setAddRollIsOpen(false);
        }}
      />
      <EditRollModal
        isOpen={Boolean(editRollId)}
        rollId={editRollId}
        onDismiss={(e, roll?: configuredRoll) => {
          e.preventDefault();
          if (roll) {
            emitEvent({
              path: 'edit-roll',
              title: 'edit roll',
            });
            const updatedRolls = rolls
              .filter(({ id }) => id !== roll.id)
              .concat(roll);
            setRolls(updatedRolls);
          }

          setEditRollId('');
        }}
      />
      {loadRollIsOpen && (
        <LoadRollsModal
          isOpen={loadRollIsOpen}
          onDismiss={handleLoadRolls}
          loadedRolls={rolls}
          storedRollIds={storedRollIds}
        />
      )}
      <Box
        as="form"
        sx={(styles) => ({ borderTop: `1px ${styles.colors.text} solid` })}
        mt={3}
      >
        <Heading
          color="text"
          as="h3"
          mt={2}
          mr={3}
          fontWeight="600"
          sx={{ display: 'inline-box' }}
        >
          Build a Roll
        </Heading>
        <Button
          type="button"
          variant="clear"
          p="0px"
          fontSize={1}
          onClick={(e) => {
            e.preventDefault();
            clearDiceForms();
          }}
        >
          Clear Form
        </Button>
        <StandardDice
          customDiceValues={customDiceValues}
          updateCustomDiceValue={updateCustomDiceValue}
        />
        <CustomDice
          customDice={customDice}
          customDiceValues={customDiceValues}
          updateCustomDiceValue={updateCustomDiceValue}
          setCreateDieIsOpen={setCreateDieIsOpen}
        />
        <Box mt={4}>
          <Heading color="secondary" fontWeight="600" as="h4" fontSize={2}>
            Final Touches
          </Heading>
          <Flex
            justifyContent="space-between"
            alignItems="flex-end"
            flexWrap="wrap"
          >
            <Box flex={['1 0 100%', '1 0 40%', '1 0 40%']} mr={[0, 1, 1]}>
              <Label color="text" fontSize={2} htmlFor="assorted-modifier">
                Roll Modifier
              </Label>
              <Input
                color="text"
                disabled={addToCurrentRollIsChecked}
                placeholder="0"
                name="assorted-modifier"
                id="assorted-modifier"
                value={assortedModifier}
                type="number"
                step="1"
                onChange={(e) => setAssortedModifier(e.target.value)}
                sx={{
                  ':disabled': {
                    backgroundColor: 'muted',
                    cursor: 'not-allowed',
                  },
                }}
              />
            </Box>
            <Box
              flex={['1 0 100%', '1 0 40%', '1 0 40%']}
              mt={2}
              ml={[0, 1, 1]}
            >
              <Label color="text" fontSize={2} htmlFor="roll name">
                Roll Name
              </Label>
              <Input
                color="text"
                disabled={addToCurrentRollIsChecked}
                placeholder="Open your brain"
                name="roll name"
                id="roll name"
                value={assortedLabel}
                onChange={(e) => setAssortedLabel(e.target.value)}
                sx={{
                  ':disabled': {
                    backgroundColor: 'muted',
                    cursor: 'not-allowed',
                  },
                }}
              />
            </Box>
          </Flex>
          <Box
            mt={3}
            sx={{
              display: 'grid',
              gridGap: 2, // theme.space[3]
              gridTemplateColumns: 'repeat(auto-fit, minmax(124px, 1fr))',
            }}
          >
            <Button
              width="100%"
              onClick={(e) => {
                e.preventDefault();
                emitEvent({
                  path: 'roll-assorted',
                  title: 'roll assorted',
                });
                const dice: diceNeedsSubmission = R.mapObjIndexed(
                  (val, key) => ({
                    needs: val ? Number.parseInt(val, 10) : 0,
                    sides: customDice.find(({ name }) => name === key)
                      ? customDice.find(({ name }) => name === key).sides
                      : parseInt(key.substr(1), 10),
                    name: customDice.find(({ name }) => name === key)
                      ? customDice.find(({ name }) => name === key).name
                      : key,
                  }),
                  customDiceValues
                );
                const modifier = addToCurrentRollIsChecked
                  ? '0'
                  : assortedModifier || '0';
                const name = addToCurrentRollIsChecked
                  ? ''
                  : assortedLabel.trim() ||
                    Object.entries(dice)
                      .filter(([key, val]) => val.needs !== 0)
                      .map(([key, val]) => `${val.needs}${val.name}`)
                      .join(', ')
                      .concat(` + ${modifier}`);
                onSubmit(dice, {
                  name,
                  modifier,
                  addToCurrentRoll: addToCurrentRollIsChecked,
                });
              }}
            >
              Roll the Dice
            </Button>
            {hasRolls && (
              <Label
                htmlFor="add-to-current-roll-checkbox"
                color="text"
                fontSize={2}
                alignSelf="center"
              >
                <Checkbox
                  color="text"
                  id="add-to-current-roll-checkbox"
                  name="add-to-current-roll-checkbox"
                  checked={addToCurrentRollIsChecked}
                  onChange={() => {
                    setAddToCurrentRollIsChecked((val) => !val);
                  }}
                />
                Add to current roll
              </Label>
            )}
            {addToCurrentRollIsChecked && (
              <Text color="text" sx={{ gridColumn: '1 / 3' }}>
                Roll results will be merged with current showing results and its
                history entry
              </Text>
            )}
          </Box>
        </Box>
        <CreateDieModal
          isOpen={createDieIsOpen}
          onDismiss={(e, die?, emitToRoom?) => {
            setCreateDieIsOpen(false);
            if (die) {
              if (emitToRoom) {
                socket.emit('add-die', { die });
              } else {
                setCustomDice(customDice.concat(die));
                addCustomDieToValues(die);
              }
            }
          }}
        />
      </Box>
    </Box>
  );
};

/**
 * DICE AREAS
 */

interface VisibilityMachineSchema {
  states: {
    invisible: Record<string, unknown>;
    hiding: Record<string, unknown>;
    visible: Record<string, unknown>;
    showing: Record<string, unknown>;
  };
}

type VisibilityEvent = { type: 'SHOW' } | { type: 'HIDE' };

const CustomVisibilityMachine = Machine<
  VisibilityMachineSchema,
  VisibilityEvent
>({
  id: 'customDiceVisibility',
  initial: 'visible',
  states: {
    hidden: {
      on: {
        SHOW: {
          target: 'showing',
        },
      },
    },
    hiding: {
      invoke: {
        src: 'hide',
        onDone: {
          target: 'hidden',
        },
      },
      on: {
        SHOW: {
          target: 'showing',
        },
      },
    },
    showing: {
      invoke: {
        src: 'show',
        onDone: {
          target: 'visible',
        },
      },
      on: {
        HIDE: {
          target: 'hiding',
        },
      },
    },
    visible: {
      on: {
        HIDE: {
          target: 'hiding',
        },
      },
    },
  },
});

function CustomDice({
  updateCustomDiceValue,
  customDiceValues,
  customDice,
  setCreateDieIsOpen,
}) {
  const node = React.useRef(null);
  const show = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenLite.to(node.current, {
        height: 'auto',
        opacity: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: Sine.easeOut,
        onComplete: resolve,
      });
    });
  }, []);

  const hide = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenLite.to(node.current, {
        height: '0px',
        opacity: 0,
        visibility: 'hidden',
        duration: 0.3,
        ease: Sine.easeOut,
        onComplete: resolve,
      });
    });
  }, []);

  const [state, dispatch] = useMachine(CustomVisibilityMachine, {
    services: {
      show,
      hide,
    },
  });
  return (
    <>
      <Box mt={4}>
        <Heading
          color="secondary"
          as="h4"
          mr={3}
          fontWeight="600"
          fontSize={2}
          sx={{ display: 'inline-box' }}
        >
          Custom Dice
        </Heading>
        <Button
          type="button"
          variant="clear"
          p="0px"
          fontSize={1}
          onClick={(e) => {
            e.preventDefault();
            state.value === 'visible' ? dispatch('HIDE') : dispatch('SHOW');
          }}
        >
          {state.value === 'visible' ? 'Hide' : 'Show'}
        </Button>
        <Box />
      </Box>
      <Box ref={node}>
        <Button
          width="100%"
          variant="secondary"
          type="button"
          mt={2}
          onClick={() => {
            setCreateDieIsOpen(true);
          }}
        >
          Create a custom die
        </Button>
        <Box
          sx={{
            display: 'grid',
            gridGap: 2, // theme.space[3]
            gridTemplateColumns: 'repeat(auto-fit, minmax(124px, 1fr))',
          }}
        >
          {customDice.map((die) => (
            <DieInput
              key={die.name}
              name={die.name}
              setter={updateCustomDiceValue(die.name)}
              value={customDiceValues[die.name]}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

const StandardVisibilityMachine = Machine<
  VisibilityMachineSchema,
  VisibilityEvent
>({
  id: 'standardDiceVisibility',
  initial: 'visible',
  states: {
    hidden: {
      on: {
        SHOW: {
          target: 'showing',
        },
      },
    },
    hiding: {
      invoke: {
        src: 'hide',
        onDone: {
          target: 'hidden',
        },
      },
      on: {
        SHOW: {
          target: 'showing',
        },
      },
    },
    showing: {
      invoke: {
        src: 'show',
        onDone: {
          target: 'visible',
        },
      },
      on: {
        HIDE: {
          target: 'hiding',
        },
      },
    },
    visible: {
      on: {
        HIDE: {
          target: 'hiding',
        },
      },
    },
  },
});

function StandardDice({ updateCustomDiceValue, customDiceValues }) {
  const node = React.useRef(null);

  const show = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenLite.to(node.current, {
        height: 'auto',
        opacity: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: Sine.easeOut,
        onComplete: resolve,
      });
    });
  }, []);

  const hide = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenLite.to(node.current, {
        height: '0px',
        opacity: 0,
        visibility: 'hidden',
        duration: 0.3,
        ease: Sine.easeOut,
        onComplete: resolve,
      });
    });
  }, []);

  const [state, dispatch] = useMachine(StandardVisibilityMachine, {
    services: {
      show,
      hide,
    },
  });

  const standardDice = [
    {
      name: 'd2',
      setter: updateCustomDiceValue('d2'),
      value: customDiceValues.d2,
    },
    {
      name: 'd4',
      setter: updateCustomDiceValue('d4'),
      value: customDiceValues.d4,
    },
    {
      name: 'd6',
      setter: updateCustomDiceValue('d6'),
      value: customDiceValues.d6,
    },
    {
      name: 'd8',
      setter: updateCustomDiceValue('d8'),
      value: customDiceValues.d8,
    },
    {
      name: 'd10',
      setter: updateCustomDiceValue('d10'),
      value: customDiceValues.d10,
    },
    {
      name: 'd12',
      setter: updateCustomDiceValue('d12'),
      value: customDiceValues.d12,
    },
    {
      name: 'd20',
      setter: updateCustomDiceValue('d20'),
      value: customDiceValues.d20,
    },
    {
      name: 'd100',
      setter: updateCustomDiceValue('d100'),
      value: customDiceValues.d100,
    },
  ];

  return (
    <>
      <Box mt={2}>
        <Heading
          color="secondary"
          fontWeight="600"
          as="h4"
          fontSize={2}
          mr={3}
          sx={{ display: 'inline-box' }}
        >
          Standard Dice
        </Heading>
        <Button
          mr={3}
          type="button"
          variant="clear"
          p="0px"
          fontSize={1}
          onClick={(e) => {
            e.preventDefault();
            state.value === 'visible' ? dispatch('HIDE') : dispatch('SHOW');
          }}
        >
          {state.value === 'visible' ? 'Hide' : 'Show'}
        </Button>
      </Box>
      <Box
        ref={node}
        sx={{
          display: 'grid',
          gridGap: 2, // theme.space[3]
          gridTemplateColumns: 'repeat(auto-fit, minmax(124px, 1fr))',
        }}
      >
        {standardDice.map((die) => (
          <DieInput {...die} key={die.name} />
        ))}
      </Box>
    </>
  );
}

function DieInput({
  name,
  setter,
  value,
}: {
  name: string;
  setter: (val: string) => void;
  value: string;
}) {
  return (
    <Box mt={2}>
      <Label color="text" fontSize={2} htmlFor={name}>
        Number of {name}
      </Label>
      <Input
        color="text"
        type="number"
        name={name}
        id={name}
        min="1"
        max="20"
        onChange={(e) => setter(e.target.value)}
        value={value}
      />
    </Box>
  );
}

export default DiceSelectionForm;
