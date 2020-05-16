import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading } from 'rebass';
import { Label, Input } from '@rebass/forms';

const AddRollModal = ({ isOpen, onDismiss }) => {
  const [rollName, setRollName] = React.useState('');
  const [dice, setDice] = React.useState([]);
  const [modifier, setModifier] = React.useState('');
  const submit = (e) => {
    const roll = { rollName, dice, modifier };
    setRollName('');
    setDice([]);
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
            <Box key={`die-${i}`}>
              <Label htmlFor={`die-${i}-type`}>Die {i + 1} Type</Label>
              <Input
                name={`die-${i}-type`}
                id={`die-${i}-type`}
                value={d}
                onChange={(e) => {
                  const newDice = dice.slice();
                  newDice[i] = e.target.value;
                  setDice(newDice);
                }}
                type="number"
                mt={2}
              />
            </Box>
          );
        })}
        <Button type="button" onClick={() => setDice(dice.concat('6'))} mt={2}>
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
