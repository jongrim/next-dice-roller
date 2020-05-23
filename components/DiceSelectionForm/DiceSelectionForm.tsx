import * as React from 'react';
import { Box, Button, Flex, Heading, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import { TweenMax, Elastic } from 'gsap';

import AddRollModal from '../AddRollModal';
import LoadRollsModal from '../LoadRollsModal';

interface SaveRollsAnimationMachine {
  states: {
    static: {};
    animatingIn: {};
    waiting: {};
    animatingOut: {};
  };
}

type SaveRollsAnimationEvents = { type: 'ANIMATE' };

const SaveRollsAnimationMachine = Machine<
  SaveRollsAnimationMachine,
  SaveRollsAnimationEvents
>({
  id: 'saveRollsAnimation',
  initial: 'static',
  states: {
    static: {
      on: {
        ANIMATE: 'animatingIn',
      },
    },
    animatingIn: {
      invoke: {
        src: 'showSaveIcon',
        onDone: {
          target: 'waiting',
        },
      },
    },
    animatingOut: {
      invoke: {
        src: 'hideSaveIcon',
        onDone: {
          target: 'static',
        },
      },
    },
    waiting: {
      after: {
        3000: 'animatingOut',
      },
    },
  },
});

type diceNeedsSubmission = {
  d6: number;
  d8: number;
  d10: number;
  d12: number;
  d20: number;
  d100: number;
};

export type configuredRoll = {
  rollName: string;
  dice: string[];
  modifier: string;
};

type rollInfo = { name: string; modifier: string };
interface DiceSelectionFormProps {
  onSubmit: (needs: diceNeedsSubmission, meta?: rollInfo) => void;
}

const DiceSelectionForm: React.FC<DiceSelectionFormProps> = ({ onSubmit }) => {
  const saveText = React.useRef(null);
  const saveIcon = React.useRef(null);
  const showSaveIcon = React.useCallback(() => {
    return new Promise((resolve) => {
      const hideSaveText = () =>
        TweenMax.to(saveText.current, 1, {
          visibility: 'hidden',
        });
      TweenMax.to(saveText.current, 0.5, {
        visibility: 'hidden',
        scale: 0.6,
        ease: Elastic.easeOut.config(1, 1),
        onComplete: hideSaveText,
      });
      TweenMax.to(saveIcon.current, 0.5, {
        visibility: 'visible',
        scale: 1,
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      }).delay(0.3);
    });
  }, []);
  const hideSaveIcon = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenMax.to(saveText.current, 1, {
        visibility: 'visible',
        scale: 1,
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
      TweenMax.to(saveIcon.current, 0.5, {
        visibility: 'hidden',
        scale: 0.6,
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);

  const [current, dispatch] = useMachine(SaveRollsAnimationMachine, {
    services: {
      showSaveIcon,
      hideSaveIcon,
    },
  });

  const [storedRolls, setStoredRolls] = React.useState<configuredRoll[]>([]);
  const [addRollIsOpen, setAddRollIsOpen] = React.useState(false);
  const [loadRollIsOpen, setLoadRollIsOpen] = React.useState(false);
  const [rolls, setRolls] = React.useState<configuredRoll[]>([]);

  const [d6, setD6] = React.useState('');
  const [d8, setD8] = React.useState('');
  const [d10, setD10] = React.useState('');
  const [d12, setD12] = React.useState('');
  const [d20, setD20] = React.useState('');
  const [d100, setD100] = React.useState('');
  const [assortedModifier, setAssortedModifier] = React.useState('');

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

  React.useEffect(() => {
    const localRolls = window.localStorage.getItem('rolls');
    if (localRolls) {
      setStoredRolls(JSON.parse(localRolls));
    }
  }, [setStoredRolls]);

  return (
    <Flex flexDirection="column">
      <Heading as="h3" fontSize={3}>
        Your Configured Rolls
      </Heading>
      <Box mt={2}>
        {rolls.map((roll, i) => {
          return (
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              key={roll.rollName}
            >
              <Text key={roll.rollName}>{roll.rollName}</Text>
              <Box>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    const needs = roll.dice.reduce((acc, cur) => {
                      return {
                        ...acc,
                        [`d${cur}`]: acc[`d${cur}`] ? acc[`d${cur}`] + 1 : 1,
                      };
                    }, {});
                    onSubmit(needs as diceNeedsSubmission, {
                      name: roll.rollName,
                      modifier: roll.modifier,
                    });
                  }}
                >
                  Roll
                </Button>
                <Button
                  ml={2}
                  type="button"
                  variant="danger"
                  onClick={() => {
                    setRolls(rolls.filter((_, index) => index !== i));
                  }}
                >
                  Remove
                </Button>
              </Box>
            </Flex>
          );
        })}
        <Button
          width="100%"
          type="button"
          onClick={() => setAddRollIsOpen(true)}
          mt={2}
        >
          Add a Roll
        </Button>
        <Flex mt={2} justifyContent="space-between">
          <Button
            variant="ghost"
            width="48%"
            type="button"
            onClick={() => {
              dispatch('ANIMATE');
              window.localStorage.setItem('rolls', JSON.stringify(rolls));
            }}
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text ref={saveText} sx={{ position: 'absolute' }}>
              Save Rolls
            </Text>
            <Image
              src="/check.svg"
              alt="saved"
              height="18px"
              ref={saveIcon}
              sx={{
                position: 'absolute',
                visibility: 'hidden',
                transform: 'scale(0.6, 0.6)',
              }}
            />
          </Button>
          <Button
            disabled={storedRolls.length === 0}
            variant="ghost"
            width="48%"
            type="button"
            onClick={() => {
              setLoadRollIsOpen(true);
            }}
          >
            Load Rolls
          </Button>
        </Flex>
      </Box>
      <AddRollModal
        isOpen={addRollIsOpen}
        onDismiss={(e, roll?: configuredRoll) => {
          e.preventDefault();
          if (roll) {
            setRolls(rolls.concat([roll]));
          }
          setAddRollIsOpen(false);
        }}
      />
      {loadRollIsOpen && (
        <LoadRollsModal isOpen={loadRollIsOpen} onDismiss={handleLoadRolls} />
      )}
      <Box
        as="form"
        sx={(styles) => ({ borderTop: `1px ${styles.colors.text} solid` })}
        mt={3}
      >
        <Heading as="h3" fontSize={3} mt={2}>
          Assorted Dice
        </Heading>
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Box width={1 / 4} mt={2} mr={1}>
            <Label fontSize={2} htmlFor="d6">
              Number of d6
            </Label>
            <Input
              type="number"
              name="d6"
              id="d6"
              min="1"
              max="20"
              onChange={(e) => setD6(e.target.value)}
              value={d6}
            />
          </Box>
          <Box width={1 / 4} mt={2} mr={1}>
            <Label fontSize={2} htmlFor="d8">
              Number of d8
            </Label>
            <Input
              type="number"
              name="d8"
              id="d8"
              min="1"
              max="20"
              onChange={(e) => setD8(e.target.value)}
              value={d8}
            />
          </Box>
          <Box width={1 / 4} mt={2} mr={1}>
            <Label fontSize={2} htmlFor="d10">
              Number of d10
            </Label>
            <Input
              type="number"
              name="d10"
              id="d10"
              min="1"
              max="20"
              onChange={(e) => setD10(e.target.value)}
              value={d10}
            />
          </Box>
          <Box width={1 / 4} mt={2} mr={1}>
            <Label fontSize={2} htmlFor="d12">
              Number of d12
            </Label>
            <Input
              type="number"
              name="d12"
              id="d12"
              min="1"
              max="20"
              onChange={(e) => setD12(e.target.value)}
              value={d12}
            />
          </Box>
          <Box width={1 / 4} mt={2} mr={1}>
            <Label fontSize={2} htmlFor="d20">
              Number of d20
            </Label>
            <Input
              type="number"
              name="d20"
              id="d20"
              min="1"
              max="20"
              onChange={(e) => setD20(e.target.value)}
              value={d20}
            />
          </Box>
          <Box width={1 / 4} mt={2} mr={1}>
            <Label fontSize={2} htmlFor="d100">
              Number of d100
            </Label>
            <Input
              type="number"
              name="d100"
              id="d100"
              min="1"
              max="20"
              onChange={(e) => setD100(e.target.value)}
              value={d100}
            />
          </Box>
          <Box mt={2} width="100%">
            <Label fontSize={2} htmlFor="assorted-modifier">
              Modifier
            </Label>
            <Input
              placeholder="0"
              name="assorted-modifier"
              id="assorted-modifier"
              value={assortedModifier}
              type="number"
              step="1"
              onChange={(e) => setAssortedModifier(e.target.value)}
            />
          </Box>
        </Flex>
        <Button
          width="100%"
          mt={2}
          onClick={(e) => {
            e.preventDefault();
            const dice = {
              d6: d6 ? Number.parseInt(d6, 10) : 0,
              d8: d8 ? Number.parseInt(d8, 10) : 0,
              d10: d10 ? Number.parseInt(d10, 10) : 0,
              d12: d12 ? Number.parseInt(d12, 10) : 0,
              d20: d20 ? Number.parseInt(d20, 10) : 0,
              d100: d100 ? Number.parseInt(d100, 10) : 0,
            };
            const modifier = assortedModifier || '0';
            const name = Object.entries(dice)
              .filter(([key, val]) => val !== 0)
              .map(([key, val]) => `${val}${key}`)
              .join(', ')
              .concat(` + ${modifier}`);
            onSubmit(
              {
                d6: d6 ? Number.parseInt(d6, 10) : 0,
                d8: d8 ? Number.parseInt(d8, 10) : 0,
                d10: d10 ? Number.parseInt(d10, 10) : 0,
                d12: d12 ? Number.parseInt(d12, 10) : 0,
                d20: d20 ? Number.parseInt(d20, 10) : 0,
                d100: d100 ? Number.parseInt(d100, 10) : 0,
              },
              { name, modifier }
            );
          }}
        >
          Roll dice
        </Button>
      </Box>
    </Flex>
  );
};

export default DiceSelectionForm;
