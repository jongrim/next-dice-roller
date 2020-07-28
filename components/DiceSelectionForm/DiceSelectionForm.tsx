import * as React from 'react';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import * as R from 'ramda';

import AddRollModal from '../AddRollModal';
import LoadRollsModal from '../LoadRollsModal';
import SaveRollButton from './SaveRollButton';
import CreateDieModal from '../CreateDieModal';

import { emitEvent } from '../../utils/goatcounter';
import { diceNeedsSubmission, Die } from '../../types/dice';

export interface configuredRoll {
  rollName: string;
  dice: string[];
  modifier: string;
  id: string;
}

type rollInfo = { name: string; modifier: string };
interface DiceSelectionFormProps {
  onSubmit: (needs: diceNeedsSubmission, meta?: rollInfo) => void;
}

const DiceSelectionForm: React.FC<DiceSelectionFormProps> = ({ onSubmit }) => {
  const [storedRollIds, setStoredRollIds] = React.useState<
    configuredRoll['id'][]
  >([]);
  const [addRollIsOpen, setAddRollIsOpen] = React.useState(false);
  const [loadRollIsOpen, setLoadRollIsOpen] = React.useState(false);
  const [createDieIsOpen, setCreateDieIsOpen] = React.useState(false);
  const [rolls, setRolls] = React.useState<configuredRoll[]>([]);
  const [customDice, setCustomDice] = React.useState<Die[]>([]);
  const [customDiceValues, setCustomDiceValues] = React.useState({});

  const updateCustomDiceValue = (name: string) => (value: string) =>
    setCustomDiceValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

  const [d2, setD2] = React.useState('');
  const [d4, setD4] = React.useState('');
  const [d6, setD6] = React.useState('');
  const [d8, setD8] = React.useState('');
  const [d10, setD10] = React.useState('');
  const [d12, setD12] = React.useState('');
  const [d20, setD20] = React.useState('');
  const [d100, setD100] = React.useState('');
  const [assortedModifier, setAssortedModifier] = React.useState('');
  const [assortedLabel, setAssortedLabel] = React.useState('');

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
    const localRolls = window.localStorage.getItem('rollIds');
    if (localRolls) {
      setStoredRollIds(JSON.parse(localRolls));
    }
  }, [setStoredRollIds]);

  return (
    <Box
      sx={(styles) => ({
        borderTop: [`1px ${styles.colors.text} solid`, 'none', 'none'],
      })}
      mt={[2, 0, 0]}
      pt={[2, 0, 0]}
    >
      <Heading as="h3" color="text">
        Your Configured Rolls
      </Heading>
      <Box mt={2}>
        {rolls.length === 0 && (
          <Box>
            <Text color="text" fontSize={2}>
              You haven't created any rolls yet.
            </Text>
            <Text color="text" fontSize={2}>
              Configured rolls can be quickly rolled and saved for reuse in
              future sessions. Click "Create a roll" below to get started.
            </Text>
          </Box>
        )}
        {rolls.map((roll) => {
          return (
            <Flex
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              mb={2}
              key={roll.id}
              data-testid={`configured-roll-${roll.rollName}`}
            >
              <Text color="text" key={roll.rollName}>
                {roll.rollName}
              </Text>
              <Flex>
                <Button
                  type="button"
                  variant="special"
                  onClick={() => {
                    emitEvent({
                      path: 'roll-saved-roll',
                      title: 'roll saved roll',
                    });
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
                <SaveRollButton
                  alreadySaved={storedRollIds.includes(roll.id)}
                  roll={roll}
                  saveRoll={(roll) => {
                    const newRollIdsArray = storedRollIds.concat(roll.id);
                    window.localStorage.setItem(roll.id, JSON.stringify(roll));
                    window.localStorage.setItem(
                      'rollIds',
                      JSON.stringify(newRollIdsArray)
                    );
                    setStoredRollIds(newRollIdsArray);
                  }}
                />
                <Button
                  ml={2}
                  type="button"
                  variant="danger"
                  onClick={() => {
                    emitEvent({
                      path: 'remove-saved-roll',
                      title: 'remove saved roll',
                    });
                    const newRollIds = storedRollIds.filter(
                      (id) => id !== roll.id
                    );
                    setStoredRollIds(newRollIds);
                    window.localStorage.removeItem(roll.id);
                    window.localStorage.setItem(
                      'rollIds',
                      JSON.stringify(newRollIds)
                    );
                    setRolls(rolls.filter((r) => r.id !== roll.id));
                  }}
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
          );
        })}
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
        <Heading color="text" as="h3" mt={2}>
          Build a Roll
        </Heading>
        <Heading color="text" as="h4" mt={2} fontSize={2}>
          Standard Dice
        </Heading>
        <Box
          sx={{
            display: 'grid',
            gridGap: 2, // theme.space[3]
            gridTemplateColumns: 'repeat(auto-fit, minmax(124px, 1fr))',
          }}
        >
          {[
            { name: 'd2', setter: setD2, value: d2 },
            { name: 'd4', setter: setD4, value: d4 },
            { name: 'd6', setter: setD6, value: d6 },
            { name: 'd8', setter: setD8, value: d8 },
            { name: 'd10', setter: setD10, value: d10 },
            { name: 'd12', setter: setD12, value: d12 },
            { name: 'd20', setter: setD20, value: d20 },
            { name: 'd100', setter: setD100, value: d100 },
          ].map((die) => (
            <DieInput {...die} key={die.name} />
          ))}
        </Box>
        <Heading color="text" as="h4" mt={2} fontSize={2}>
          Custom Dice
        </Heading>
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
        <Flex
          justifyContent="space-between"
          alignItems="flex-end"
          flexWrap="wrap"
        >
          <Box flex={['1 0 100%', '1 0 40%', '1 0 40%']} mt={2} mr={[0, 1, 1]}>
            <Label color="text" fontSize={2} htmlFor="assorted-modifier">
              Modifier
            </Label>
            <Input
              color="text"
              placeholder="0"
              name="assorted-modifier"
              id="assorted-modifier"
              value={assortedModifier}
              type="number"
              step="1"
              onChange={(e) => setAssortedModifier(e.target.value)}
            />
          </Box>
          <Box flex={['1 0 100%', '1 0 40%', '1 0 40%']} mt={2} ml={[0, 1, 1]}>
            <Label color="text" fontSize={2} htmlFor="roll name">
              Name
            </Label>
            <Input
              color="text"
              placeholder="Open your brain"
              name="roll name"
              id="roll name"
              value={assortedLabel}
              onChange={(e) => setAssortedLabel(e.target.value)}
            />
          </Box>
        </Flex>
        <Button
          width="100%"
          mt={3}
          onClick={(e) => {
            e.preventDefault();
            emitEvent({
              path: 'roll-assorted',
              title: 'roll assorted',
            });
            const customVals = R.mapObjIndexed(
              (val) => Number.parseInt(val, 10),
              customDiceValues
            );
            const dice = {
              d2: d2 ? Number.parseInt(d2, 10) : 0,
              d4: d4 ? Number.parseInt(d4, 10) : 0,
              d6: d6 ? Number.parseInt(d6, 10) : 0,
              d8: d8 ? Number.parseInt(d8, 10) : 0,
              d10: d10 ? Number.parseInt(d10, 10) : 0,
              d12: d12 ? Number.parseInt(d12, 10) : 0,
              d20: d20 ? Number.parseInt(d20, 10) : 0,
              d100: d100 ? Number.parseInt(d100, 10) : 0,
              ...customVals,
            };
            const modifier = assortedModifier || '0';
            const name =
              assortedLabel.trim() ||
              Object.entries(dice)
                .filter(([key, val]) => val !== 0)
                .map(([key, val]) => `${val}${key}`)
                .join(', ')
                .concat(` + ${modifier}`);
            onSubmit(dice, { name, modifier });
          }}
        >
          Roll the Dice
        </Button>
        <CreateDieModal
          isOpen={createDieIsOpen}
          onDismiss={(e, die) => {
            setCreateDieIsOpen(false);
            setCustomDice(customDice.concat(die));
          }}
        />
      </Box>
    </Box>
  );
};

function DieInput({
  name,
  setter,
  value,
}: {
  name: string;
  setter: Function;
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
