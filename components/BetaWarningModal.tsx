import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading, Text } from 'rebass';
import { useTheme } from 'emotion-theming';
import useLocalStorage from '../hooks/useLocalStorage';

const BetaWarningModal = ({}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useLocalStorage(
    'show-graphic-dice-warning',
    true
  );

  const dismiss = () => setIsOpen(false);
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={dismiss}
      aria-label="Beta warning"
      // @ts-ignore
      style={{ backgroundColor: theme.colors.background }}
    >
      <Box py={2} bg="background">
        <Heading as="h2" fontSize={[3, 4, 5]} color="text">
          New Stuff!
        </Heading>
        <Text fontSize={2} color="text">
          Hey! This area is all pretty new and still being tested out for
          issues. It's under active development so stuff may move and change as
          well.
        </Text>
        <Text fontSize={2} color="text" mt={1}>
          I would love to hear your feedback. Is there something vital that is
          missing? Is something hard to use or set up in a weird way? Found a
          bug? Feel free to{' '}
          <a href="https://twitter.com/jonjongrim" style={{ color: '#3075AB' }}>
            message me
          </a>{' '}
          or{' '}
          <a href="mailto:jonjongrim@gmail.com" style={{ color: '#3075AB' }}>
            send me an email
          </a>
          .
        </Text>
      </Box>
      <Button onClick={dismiss}>
        Dismiss (you won't see this warning again)
      </Button>
    </Dialog>
  );
};

export default BetaWarningModal;
