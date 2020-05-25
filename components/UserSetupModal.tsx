import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';

interface UserSetupModalProps {
  storedUsername: string;
  setStoredUsername: (arg0: string) => void;
}

const UserSetupModal: React.FC<UserSetupModalProps> = ({
  storedUsername,
  setStoredUsername,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!storedUsername) {
      setIsOpen(true);
    }
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() => {
        if (storedUsername) {
          setIsOpen(false);
        } else {
          setError('Please enter a username for this room');
        }
      }}
      aria-label="Form to setup username and select icon"
    >
      <Box py={2}>
        <Heading as="h2" fontSize={[3, 4, 5]}>
          Set your username
        </Heading>
        <Text fontSize={2}>
          Your username is specific to this room and set each time you enter
        </Text>
      </Box>
      <Box as="form" mt={2}>
        <Label htmlFor="username">Username</Label>
        <Input
          name="username"
          id="username"
          value={storedUsername}
          onChange={(e) => setStoredUsername(e.target.value)}
          mt={2}
          required
        />
        {error && (
          <Text fontSize={1} color="danger" mt={1}>
            {error}
          </Text>
        )}
        <Button
          mt={3}
          width="100%"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (storedUsername) {
              setIsOpen(false);
            } else {
              setError('Please enter a username for this room');
            }
          }}
        >
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default UserSetupModal;
