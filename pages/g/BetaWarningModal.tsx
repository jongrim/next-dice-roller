import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading, Text } from 'rebass';
import { useTheme } from 'emotion-theming';
import useLocalStorage from '../../hooks/useLocalStorage';

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
      style={{ backgroundColor: theme.colors.background }}
    >
      <Box py={2} bg="background">
        <Heading as="h2" fontSize={[3, 4, 5]} color="text">
          Secrets!
        </Heading>
        <Text fontSize={2} color="text">
          Hey! If you found you're way here I either told you about it or you're
          very good at snooping. Either way, just know that this area is all
          pretty new and still being tested out for issues. One known issue is
          that you can't add too many dice (around 10) before stuff starts
          getting glitchy. I'm working on improving that performance.
        </Text>
        <Text fontSize={2} color="text" mt={1}>
          Still, you're welcome to try these bits out and let me know what you
          think. Is there something vital that is missing? Found a bug? Feel
          free to{' '}
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
