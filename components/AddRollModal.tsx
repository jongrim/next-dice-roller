import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading, Text } from 'rebass';
import { Label, Input, Select } from '@rebass/forms';

const AddRollModal = ({ isOpen, onDismiss }) => {
  const [error, setErrorMessage] = React.useState('');
  const [rollName, setRollName] = React.useState('');
  const [dice, setDice] = React.useState(['6']);
  const [modifier, setModifier] = React.useState('0');
  const submit = (e) => {
    if (dice.length === 0 || dice.some((d) => !d)) {
      setErrorMessage('You must add dice to the role');
      return;
    }
    const roll = { rollName, dice, modifier };
    setRollName('');
    setDice(['6']);
    setModifier('');
    onDismiss(e, roll);
  };
  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} aria-label="Add a new roll">
      <Heading as="h3">Create a configured roll</Heading>
      <Text fontSize={1}>
        Configured rolls can be easily rolled repeatedly from the main screen
      </Text>
      <Box as="form" mt={3}>
        <Label htmlFor="rollName">Roll Name</Label>
        <Text fontSize={1}>Name this roll</Text>
        <Input
          placeholder="Go Aggro"
          value={rollName}
          name="rollName"
          id="rollName"
          onChange={(e) => setRollName(e.target.value)}
          mt={2}
        />
        <Box mt={3}>
          <Heading as="h5">Add Dice</Heading>
          <Text fontSize={1}>
            Add the types of dice this roll uses (example: 2d6)
          </Text>
          {dice.map((d, i) => {
            return (
              <Box mt={2} key={`die-${i}`}>
                <Label htmlFor={`die-${i}-type`}>Die {i + 1} Type</Label>
                <Select
                  name={`die-${i}-type`}
                  id={`die-${i}-type`}
                  mt={2}
                  value={d}
                  onChange={(e) => {
                    const newDice = dice.slice();
                    newDice[i] = e.target.value;
                    setDice(newDice);
                  }}
                >
                  <option value="6">6</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="20">20</option>
                  <option value="100">100</option>
                </Select>
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
        <Label htmlFor="modifier" mt={3}>
          Modifier
        </Label>
        <Text fontSize={1}>Applied to the roll total</Text>
        <Input
          placeholder="Go Aggro"
          type="number"
          step={1}
          value={modifier}
          name="modifier"
          id="modifier"
          onChange={(e) => setModifier(e.target.value)}
          mt={2}
        />
        <Button onClick={submit} mt={4}>
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default AddRollModal;
