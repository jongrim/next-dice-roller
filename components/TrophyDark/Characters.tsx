import * as React from 'react';
import { Box, Heading, Text } from 'rebass';
import { CLIENT_ID } from '../../pages/trophy-dark/[name]';
import StaticCharacterCard from './StaticCharacterCard';
import styles from './hr.module.css';

function useInterval(callback: Function, delay?: number | null) {
  const savedCallback = React.useRef<Function>();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      if (savedCallback && savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function Characters({
  socket,
}: {
  socket: SocketIOClient.Socket;
}): React.ReactElement {
  const [characters, setCharacters] = React.useState<
    Record<
      string,
      {
        playerName: string;
        clientId: string;
        imageSrc?: string;
        name: string;
        pronouns: string;
        occupation: string;
        background: string;
        ritual1?: string;
        ritual2?: string;
        ritual3?: string;
        drive: string;
        baseRuin: number;
        ruin: number;
        lastSeenTime: number;
      }
    >
  >({});

  const [characterHeartbeats, setCharacterHeartbeats] = React.useState<
    { clientId: string; lastSeenTime: number }[]
  >([]);

  const deleteCharacter = (clientId: string) => {
    setCharacters((characterMap) => {
      const newMap = { ...characterMap };
      delete newMap[clientId];
      return newMap;
    });
  };

  React.useEffect(() => {
    if (socket) {
      socket.on('character-update', (data) => {
        if (data.clientId !== CLIENT_ID) {
          setCharacters((characterMap) => ({
            ...characterMap,
            [data.clientId]: {
              ...characterMap[data.clientId],
              ...data,
            },
          }));
          setCharacterHeartbeats((cur) => [
            ...cur,
            { clientId: data.clientId, lastSeenTime: Date.now() },
          ]);
        }
      });
      socket.on('heartbeat', ({ clientId }) => {
        if (clientId !== CLIENT_ID) {
          setCharacterHeartbeats((cur) =>
            cur.map((beat) => {
              if (beat.clientId === clientId) {
                return { clientId, lastSeenTime: Date.now() };
              }
              return beat;
            })
          );
        }
      });
    }
  }, [socket]);

  useInterval(() => {
    characterHeartbeats.forEach((beat) => {
      if (beat.lastSeenTime < Date.now() - 7000) {
        deleteCharacter(beat.clientId);
      }
    });
  }, 6000);

  const characterArray = Object.values(characters);
  return (
    <Box width="100%" my={6}>
      <Box mb={6}>
        <Heading
          as="h2"
          id="characters"
          sx={{ gridColumn: '1 / 3' }}
          variant="text.h2"
        >
          Characters
        </Heading>
        <hr className={styles.hr} />
      </Box>
      {characterArray.length === 0 && (
        <Text as="p" variant="text.p">
          Waiting for some brave adventurers...
        </Text>
      )}
      {characterArray.map((character) => (
        <StaticCharacterCard {...character} key={character.clientId} />
      ))}
    </Box>
  );
}
