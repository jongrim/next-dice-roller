import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading, Text } from 'rebass';
import { Label, Input, Radio } from '@rebass/forms';
import { useTheme } from 'emotion-theming';

interface GameEnterModalProps {
  onDone: (name: string, role: string) => void;
}

function GameEnterModal({ onDone }: GameEnterModalProps): React.ReactElement {
  const theme = useTheme();
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('');
  const [error, setError] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(true);

  const finish = () => {
    if (name && role) {
      onDone(name, role);
      setIsOpen(false);
      return;
    }
    setError('Please complete all fields');
  };

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={finish}
      aria-label="Enter player info"
      // @ts-ignore
      style={{ backgroundColor: theme.colors.background }}
    >
      <Box py={2} bg="background">
        <Heading as="h2" color="text" variant="text.h2">
          Player Info
        </Heading>
        <Label my={3} htmlFor="player-name" color="text" variant="text.label">
          Name and pronouns
        </Label>
        <Input
          variant="text.p"
          name="player-name"
          id="player-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          mt={2}
        />
        <Text variant="text.label" mt={6}>
          Select your role
        </Text>
        <Label my={3} htmlFor="player" color="text" variant="text.label">
          <Radio
            sx={{
              'input:checked ~ &': {
                color: 'text',
              },
              cursor: 'pointer',
            }}
            checked={role === 'player'}
            onChange={() => setRole('player')}
            id="player"
            name="role"
            value="player"
          />
          Player
        </Label>
        <Label my={3} htmlFor="gm" color="text" variant="text.label">
          <Radio
            sx={{
              'input:checked ~ &': {
                color: 'text',
              },
              cursor: 'pointer',
            }}
            checked={role === 'gm'}
            onChange={() => setRole('gm')}
            id="gm"
            name="role"
            value="gm"
          />
          GM
        </Label>
      </Box>
      {error && (
        <Text color="dangerText" fontFamily="body" fontSize="body">
          {error}
        </Text>
      )}
      <Button my={3} variant="ghost" onClick={finish}>
        Done
      </Button>
    </Dialog>
  );
}

export default GameEnterModal;
