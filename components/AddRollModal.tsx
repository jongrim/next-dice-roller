import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { Label, Input, Select } from '@rebass/forms';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from 'emotion-theming';

import { configuredRoll } from './DiceSelectionForm/DiceSelectionForm';

interface AddRollModalProps {
  isOpen: boolean;
  onDismiss: (e: React.SyntheticEvent, roll?: configuredRoll) => void;
}

const AddRollModal: React.FC<AddRollModalProps> = ({ isOpen, onDismiss }) => {
  const theme = useTheme();
  const [error, setErrorMessage] = React.useState('');
  const [rollName, setRollName] = React.useState('');
  const [dice, setDice] = React.useState(['6']);
  const [modifier, setModifier] = React.useState('');
  const submit = (e: React.SyntheticEvent) => {
    if (dice.length === 0 || dice.some((d) => !d)) {
      e.preventDefault();
      setErrorMessage('We need dice to be able to roll! Please add some now.');
      return;
    }
    const roll = { rollName, dice, modifier, id: uuidv4() };
    setRollName('');
    setDice(['6']);
    setModifier('');
    onDismiss(e, roll);
  };
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      aria-label="Add a new roll"
      // @ts-ignore
      style={{ backgroundColor: theme.colors.background }}
    >
      <Heading color="text" as="h3">
        Create a configured roll
      </Heading>
      <Text color="text" fontSize={1}>
        Configured rolls can be easily rolled repeatedly from the main screen
        and saved for future sessions
      </Text>
      <Box as="form" data-testid="add-roll-form" mt={3}>
        <Label color="text" htmlFor="rollName">
          Roll Name
        </Label>
        <Text color="text" fontSize={1}>
          What should we call this roll?
        </Text>
        <Input
          color="text"
          placeholder="Go Aggro"
          value={rollName}
          name="rollName"
          id="rollName"
          onChange={(e) => setRollName(e.target.value)}
          mt={2}
        />
        <Box mt={3}>
          <Heading color="text" as="h5">
            Add Dice
          </Heading>
          <Text color="text" fontSize={1}>
            What kind of dice make up this roll?
          </Text>
          <Text color="text" fontSize={1}>
            Click the "Add another die" button to add more dice, and for each
            select how many sides it has.
          </Text>
          {error && <Text color="dangerText">{error}</Text>}
          {dice.map((d, i) => {
            return (
              <Box mt={2} key={`die-${i}`}>
                <Label color="text" htmlFor={`die-${i}-type`}>
                  Die {i + 1} Type
                </Label>
                <Flex alignItems="center">
                  <Box flex="1">
                    <Select
                      color="text"
                      name={`die-${i}-type`}
                      id={`die-${i}-type`}
                      value={d}
                      onChange={(e) => {
                        const newDice = dice.slice();
                        newDice[i] = e.target.value;
                        setDice(newDice);
                      }}
                    >
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="6">6</option>
                      <option value="8">8</option>
                      <option value="10">10</option>
                      <option value="12">12</option>
                      <option value="20">20</option>
                      <option value="100">100</option>
                    </Select>
                  </Box>
                  <Button
                    ml={2}
                    variant="danger"
                    onClick={() => {
                      setDice((diceArray) =>
                        diceArray.filter((_, index) => index !== i)
                      );
                    }}
                  >
                    Delete
                  </Button>
                </Flex>
              </Box>
            );
          })}
          <Button
            type="button"
            onClick={() => setDice(dice.concat(['6']))}
            mt={2}
          >
            Add another die
          </Button>
        </Box>
        <Label color="text" htmlFor="modifier" mt={3}>
          Modifier
        </Label>
        <Text color="text" fontSize={1}>
          Is there a modifier applied to the total roll? If so, add it here.
        </Text>
        <Input
          color="text"
          placeholder="0"
          type="number"
          step={1}
          value={modifier}
          name="modifier"
          id="modifier"
          onChange={(e) => setModifier(e.target.value)}
          mt={2}
        />
        <Flex mt={3}>
          <Button onClick={submit}>Done</Button>
          <Button variant="ghost" onClick={onDismiss} ml={2}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </Dialog>
  );
};

export default AddRollModal;
