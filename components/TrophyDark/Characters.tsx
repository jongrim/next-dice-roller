import * as React from 'react';
import { Box } from 'rebass';
import StaticCharacterCard from './StaticCharacterCard';

export default function Characters({
  socket,
}: {
  socket: SocketIOClient.Socket;
}): React.ReactElement {
  const [characters, setCharacters] = React.useState<
    Record<
      string,
      {
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
      }
    >
  >({});

  React.useEffect(() => {
    if (socket) {
      socket.on('character-update', (data) => {
        setCharacters((characterMap) => ({
          ...characterMap,
          [data.name]: data,
        }));
      });
    }
  }, [socket]);
  return (
    <Box
      px={2}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
        gridGap: 5,
      }}
    >
      {Object.values(characters).map((character) => (
        <StaticCharacterCard {...character} key={character.name} />
      ))}
    </Box>
  );
}
