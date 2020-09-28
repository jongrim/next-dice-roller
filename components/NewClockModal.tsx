import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { useTheme } from 'emotion-theming';
import uniqueId from 'lodash.uniqueid';
import { CLIENT_ID } from './DiceSidebar';
import { Clock } from '../types/clock';

interface NewClockModalProps {
  isOpen: boolean;
  onDone: (clock?: Clock) => void;
}

const NewClockModal: React.FC<NewClockModalProps> = ({ isOpen, onDone }) => {
  const theme = useTheme();
  const [name, setName] = React.useState('');
  const [segments, setSegments] = React.useState('');

  const finish = (e) => {
    e.preventDefault();
    if (name && segments) {
      onDone({
        name,
        segments: parseInt(segments, 10),
        id: uniqueId(`clock-${CLIENT_ID}-`),
      });
      setName('');
    } else {
      onDone();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={finish}
      aria-label="New clock"
      // @ts-ignore
      style={{ backgroundColor: theme.colors.background }}
    >
      <Box py={2} bg="background">
        <Heading as="h2" fontSize={[3, 4, 5]} color="text">
          New Clock
        </Heading>
        <Text fontSize={2} color="text">
          Create a new clock. After, double click it to advance.
        </Text>
      </Box>
      <Box as="form" mt={2}>
        <Label htmlFor="name" color="text">
          Clock name
        </Label>
        <Input
          color="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          mt={2}
          required
        />
        <Label htmlFor="segments" color="text" mt={3}>
          How many segments should it have?
        </Label>
        <Input
          type="number"
          color="text"
          name="segments"
          id="segments"
          value={segments}
          onChange={(e) => {
            setSegments(e.target.value);
          }}
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

export default NewClockModal;
