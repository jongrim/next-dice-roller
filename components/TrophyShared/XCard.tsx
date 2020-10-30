import * as React from 'react';
import { Button, Flex, Heading, Text } from 'rebass';
import { Dialog } from '@reach/dialog';
import { useTheme } from 'emotion-theming';

export default function XCard({
  socket,
}: {
  socket: SocketIOClient.Socket;
}): React.ReactElement {
  const [played, setPlayed] = React.useState(false);
  const el = React.useRef();
  React.useEffect(() => {
    if (socket) {
      socket.on('play-x-card', () => {
        setPlayed(true);
      });
      socket.on('dismiss-x-card', () => {
        setPlayed(false);
      });
    }
  });
  return (
    <Flex
      bg="background"
      height="160px"
      width="120px"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      ml="auto"
      mr="auto"
      sx={{ position: ['', '', '', 'sticky'], top: ['', '', '', '250px'] }}
    >
      <Button
        width="100%"
        variant="ghost"
        height="100%"
        fontSize={9}
        onClick={() => socket?.emit('play-x-card')}
      >
        X
      </Button>
      <XCardModal
        isOpen={played}
        onDone={() => socket?.emit('dismiss-x-card')}
      />
    </Flex>
  );
}

const XCardModal = ({
  isOpen,
  onDone,
}: {
  isOpen: boolean;
  onDone: () => void;
}): React.ReactElement => {
  const theme: { colors: { background: string } } = useTheme();
  const [mustAcknowledge, setMustAcknowledge] = React.useState('');
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() =>
        setMustAcknowledge('You must acknowledge the x-card to proceed')
      }
      style={{ backgroundColor: theme.colors.background }}
    >
      <Heading variant="text.h2" as="h2">
        X-Card Played
      </Heading>
      <Text variant="text.p" mt={4}>
        The X-Card has been played. Pause now and talk with your group about
        what has been x-carded.
      </Text>
      {mustAcknowledge && (
        <Text color="dangerText" mt={4}>
          {mustAcknowledge}
        </Text>
      )}
      <Button variant="ghost" onClick={onDone} mt={4}>
        Acknowledge
      </Button>
    </Dialog>
  );
};
