import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading, Text } from 'rebass';
import { Label, Input, Select } from '@rebass/forms';

const AddRollModal = ({ isOpen, onDismiss }) => {
  const [error, setErrorMessage] = React.useState('');
  const [rollName, setRollName] = React.useState('');
  const [dice, setDice] = React.useState(['6']);
  const [modifier, setModifier] = React.useState('');
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
      <Box as="form">
        <Label htmlFor="rollName">Roll Name</Label>
        <Input
          placeholder="Go Aggro"
          value={rollName}
          name="rollName"
          id="rollName"
          onChange={(e) => setRollName(e.target.value)}
          mt={2}
        />
        <Heading as="h5" fontSize={2} mt={3}>
          Add Dice
        </Heading>
        {dice.map((d, i) => {
          return (
            <Box mt={2} key={`die-${i}`}>
              <Label htmlFor={`die-${i}-type`}>Die {i + 1} Type</Label>
              <Select
                name={`die-${i}-type`}
                id={`die-${i}-type`}
                mt={2}
                defaultValue="6"
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
        <Label htmlFor="modifier" mt={4}>
          Modifier
        </Label>
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
