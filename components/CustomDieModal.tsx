import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { useTheme } from 'emotion-theming';
import uniqueId from 'lodash.uniqueid';
import { GraphicDie } from '../types/dice';
import { CLIENT_ID } from './DiceSidebar';

interface CustomDieModalProps {
  isOpen: boolean;
  onDone: (die?: GraphicDie) => void;
}

const CustomDieModal = ({
  isOpen,
  onDone,
}: CustomDieModalProps): React.ReactElement => {
  const theme = useTheme();
  const [sides, setSides] = React.useState('');

  const makeDie = (sides: number): GraphicDie => ({
    sides,
    bgColor: 'black',
    fontColor: 'white',
    id: uniqueId(`die-${CLIENT_ID}-`),
    curNumber: sides,
    rollVersion: 1,
  });

  const finish = (e) => {
    e.preventDefault();
    if (sides) {
      onDone(makeDie(Number(sides)));
    } else {
      onDone();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={finish}
      aria-label="Custom Die"
      // @ts-ignore
      style={{ backgroundColor: theme.colors.background }}
    >
      <Box py={2} bg="background">
        <Heading as="h2" fontSize={[3, 4, 5]} color="text">
          New Die
        </Heading>
        <Text fontSize={2} color="text">
          Create a custom die with however many sides you need
        </Text>
      </Box>
      <Box as="form" mt={2}>
        <Label htmlFor="sides" color="text">
          Number of sides
        </Label>
        <Input
          color="text"
          name="sides"
          id="sides"
          type="number"
          value={sides}
          onChange={(e) => setSides(e.target.value)}
          mt={2}
          required
        />
        <Button mt={3} width="100%" type="submit" onClick={finish}>
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default CustomDieModal;
