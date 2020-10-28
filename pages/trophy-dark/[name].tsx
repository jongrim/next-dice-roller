import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import io from 'socket.io-client';
import { ThemeProvider } from 'emotion-theming';
import { Heading, Flex, Box, Link as StyledLink } from 'rebass';
import { v4 as uuidv4 } from 'uuid';
import theme from '../trophyDarkTheme.json';

import CharacterCard from '../../components/TrophyDark/CharacterCard';
import DiceArea from '../../components/TrophyDark/DiceArea';
import { useRouter } from 'next/router';

import styles from './trophy.module.css';
import LinesAndVeils from '../../components/TrophyShared/LinesAndVeils';
import Characters from '../../components/TrophyDark/Characters';
import GameEnterModal from '../../components/TrophyDark/GameEnterModal';

export const CLIENT_ID = uuidv4();

export default function TrophyDark(): React.ReactElement {
  const router = useRouter();
  const { name } = router.query;
  const [playerName, setPlayerName] = React.useState('');
  const [role, setRole] = React.useState('');
  React.useEffect(() => {
    if (router.query.name && !router.query.tab) {
      router.push(`/trophy-dark/${router.query.name}?tab=table`, undefined, {
        shallow: true,
      });
    }
  }, [router]);

  const [socket, setSocket] = React.useState<SocketIOClient.Socket>(null);
  React.useEffect(() => {
    if (name) {
      const ioSocket = io(`/trophydark${name}`, {
        reconnectionAttempts: 5,
        query: { name: `trophydark${name}` },
      });
      setSocket(ioSocket);
      ioSocket.on('connect_error', () => {
        console.log('connect error');
      });
      ioSocket.on('reconnect', () => {
        console.log('reconnected');
        ioSocket.emit('request-sync', { clientId: CLIENT_ID });
      });
      ioSocket.on('reconnecting', () => {
        console.log('reconnecting');
      });
      ioSocket.on('reconnect_failed', () => {
        console.log('reconnect failed');
      });
      ioSocket.emit('request-sync', { clientId: CLIENT_ID });
      return () => {
        ioSocket.close();
      };
    }
  }, [name]);
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <Flex
          flexDirection="column"
          minHeight="100vh"
          width="100vw"
          bg="background"
        >
          <Flex flexDirection="column" mb={6}>
            <Heading
              sx={{ textAlign: 'center' }}
              as="h1"
              variant="text.h1"
              py={3}
            >
              Trophy Dark
            </Heading>
          </Flex>
          {name ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplate: [
                  '100px 1fr / 1fr',
                  '100px 1fr / 1fr',
                  '1fr / minmax(124px, 1fr) 6fr 1fr',
                ],
                gridRowGap: 6,
              }}
              height="100%"
              minHeight="640px"
            >
              <Flex
                flexDirection={['row', 'row', 'column']}
                justifyContent={['space-around', 'space-around', '']}
                alignItems={['flex-start', 'flex-start', 'flex-end']}
                px={4}
                height="64px"
                sx={{
                  position: ['', '', 'sticky', 'sticky'],
                  top: ['', '', '24px', '24px'],
                }}
              >
                <Link href={`/trophy-dark/${name}?tab=table`}>
                  <StyledLink
                    variant={
                      router.query.tab === 'table'
                        ? 'text.activeLink'
                        : 'text.link'
                    }
                    pb={[0, 0, 2]}
                    sx={(styles) => ({
                      borderBottom: [
                        '',
                        '',
                        `1px solid ${styles.colors.muted}`,
                      ],
                    })}
                  >
                    Table
                  </StyledLink>
                </Link>
                <Link href={`/trophy-dark/${name}?tab=safety`}>
                  <StyledLink
                    variant={
                      router.query.tab === 'safety'
                        ? 'text.activeLink'
                        : 'text.link'
                    }
                    pt={[0, 0, 2]}
                  >
                    Safety
                  </StyledLink>
                </Link>
              </Flex>
              <Box sx={{ display: 'grid', gridTemplate: '1fr / 1fr' }}>
                <Box
                  className={styles.tab}
                  data-hidden={router.query.tab !== 'table'}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridGap: 6,
                      gridTemplate: [
                        '1fr / 1fr',
                        '1fr / 1fr',
                        '1fr / 1fr',
                        '1fr / 2fr 1fr',
                      ],
                      justifyItems: 'center',
                      height: '100%',
                    }}
                  >
                    {role === 'gm' ? (
                      <div>GM</div>
                    ) : (
                      <CharacterCard
                        socket={socket}
                        playerName={playerName}
                        roomName={Array.isArray(name) ? name[0] : name}
                      />
                    )}
                    <DiceArea socket={socket} />
                    <Characters socket={socket} />
                  </Box>
                </Box>
                <Box
                  className={styles.tab}
                  data-hidden={router.query.tab !== 'safety'}
                >
                  <LinesAndVeils />
                </Box>
              </Box>
            </Box>
          ) : (
            <div>Loading</div>
          )}
        </Flex>
        <GameEnterModal
          onDone={(name, role) => {
            setPlayerName(name);
            setRole(role);
          }}
        />
      </ThemeProvider>
    </>
  );
}
