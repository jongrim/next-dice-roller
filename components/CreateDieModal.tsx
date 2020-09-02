import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading, Text, Flex } from 'rebass';
import { Label, Input } from '@rebass/forms';
import Checkbox from './Checkbox';
import { useTheme } from 'emotion-theming';

import { Die } from '../types/dice';

interface CreateDieModalProps {
  isOpen: boolean;
  onDismiss: (e: React.SyntheticEvent, die?: Die, emitToRoom?: Boolean) => void;
}

const CreateDieModal: React.FC<CreateDieModalProps> = ({
  isOpen,
  onDismiss,
}) => {
  const theme = useTheme();
  const [error, setErrorMessage] = React.useState('');
  const [dieName, setDieName] = React.useState('');
  const [sides, setSides] = React.useState('');
  const [emitToRoom, setEmitToRoom] = React.useState(false);
  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!sides) {
      e.preventDefault();
      setErrorMessage(
        'How many sides does this die have? Please enter it below.'
      );
      return;
    }
    onDismiss(
      e,
      { name: dieName || `d${sides}`, sides: parseInt(sides, 10) },
      emitToRoom
    );
    setDieName('');
    setSides('');
  };
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      aria-label="Create a new die"
      // @ts-ignore
      style={{ backgroundColor: theme.colors.background }}
    >
      <Heading color="text" as="h3">
        Create a new die
      </Heading>
      <Text color="text" fontSize={1}>
        Custom dice can be rolled from the "Build a Roll" section or used in
        configured rolls (planned feature)
      </Text>
      <Box as="form" data-testid="create-die-form" mt={3}>
        <Label color="text" htmlFor="dieName">
          Die Name
        </Label>
        <Text color="text" fontSize={1}>
          What should we call this die? Leave blank to use its sides as the name
          (ex. d3)
        </Text>
        <Input
          color="text"
          placeholder="Threat Level"
          value={dieName}
          name="dieName"
          id="dieName"
          onChange={(e) => setDieName(e.target.value)}
          mt={2}
        />
        <Box mt={3}>
          <Label color="text" htmlFor="sides">
            Number of Sides
          </Label>
          <Text color="text" fontSize={1}>
            How many sides does the die have?
          </Text>
          {error && <Text color="dangerText">{error}</Text>}
          <Input
            color="text"
            placeholder="1"
            type="number"
            min={1}
            step={1}
            value={sides}
            name="sides"
            id="sides"
            onChange={(e) => setSides(e.target.value)}
            mt={2}
          />
        </Box>
        <Box mt={3}>
          <Label htmlFor="emit-die-to-room" color="text" fontSize={2}>
            <Checkbox
              color="text"
              id="emit-die-to-room"
              name="emit-die-to-room"
              checked={emitToRoom}
              onChange={() => {
                setEmitToRoom((val) => !val);
              }}
            />
            Share with the room - this custom die will show up for everyone
          </Label>
        </Box>
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

export default CreateDieModal;
