import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import io from 'socket.io-client';
import { ThemeProvider } from 'emotion-theming';
import { Heading, Flex, Box, Link as StyledLink, Text } from 'rebass';
import { v4 as uuidv4 } from 'uuid';
import theme from '../trophyDarkTheme.json';

import CharacterCard from '../../components/TrophyDark/CharacterCard';
import DiceArea from '../../components/TrophyDark/DiceArea';
import { useRouter } from 'next/router';

import styles from './trophy.module.css';
import LinesAndVeils from '../../components/TrophyShared/LinesAndVeils';
import Characters from '../../components/TrophyDark/Characters';
import GameEnterModal from '../../components/TrophyDark/GameEnterModal';
import GM from '../../components/TrophyDark/GM';
import XCard from '../../components/TrophyShared/XCard';

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
          minWidth="100vw"
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
                gridGap: 6,
              }}
              height="100%"
              minHeight="72vh"
              mb={[0, 0, 0, 6]}
              p={[4, 4, 0, 0]}
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
                      gridGap: 4,
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
                    {role === 'gm' && (
                      <GM roomName={Array.isArray(name) ? name[0] : name} />
                    )}
                    {role === 'player' && (
                      <CharacterCard
                        socket={socket}
                        playerName={playerName}
                        roomName={Array.isArray(name) ? name[0] : name}
                      />
                    )}
                    {role === '' && <Box />}
                    <Box
                      sx={{
                        position: ['', '', '', 'sticky'],
                        top: ['', '', '', '0'],
                      }}
                    >
                      <DiceArea socket={socket} />
                      <XCard socket={socket} />
                    </Box>
                    <Characters socket={socket} />
                  </Box>
                </Box>
                <Box
                  className={styles.tab}
                  data-hidden={router.query.tab !== 'safety'}
                  overflowX="scroll"
                >
                  <LinesAndVeils socket={socket} />
                </Box>
              </Box>
            </Box>
          ) : (
            <Flex justifyContent="center" alignItems="center" height="70vh">
              <Heading variant="Heading.h2">Loading</Heading>
            </Flex>
          )}
          <Box
            p={4}
            sx={(styles) => ({
              borderTop: `1px solid ${styles.colors.muted}`,
            })}
          >
            <Box sx={{ textAlign: 'center' }} mb={4}>
              <Text variant="text.footer">
                This work is based on{' '}
                <StyledLink
                  variant="text.paragraphLink"
                  href="https://trophyrpg.com"
                >
                  Trophy
                </StyledLink>
                , product of Jesse Ross and Hedgemaze Press, and licensed for
                our use under the{' '}
                <StyledLink
                  variant="text.paragraphLink"
                  href="https://creativecommons.org/licenses/by/4.0/"
                >
                  Creative Commons Attribution 4.0 License
                </StyledLink>
                . Trophy is adapted from Cthulhu Dark with permission of Graham
                Walmsley. Trophy is also based on{' '}
                <StyledLink
                  variant="text.paragraphLink"
                  href="http://www.bladesinthedark.com/"
                >
                  Blades in the Dark
                </StyledLink>
                , product of One Seven Design, developed and authored by John
                Harper, and licensed for our use under the{' '}
                <StyledLink
                  variant="text.paragraphLink"
                  href="http://creativecommons.org/licenses/by/3.0/"
                >
                  Creative Commons Attribution 3.0 Unported license
                </StyledLink>
                .
              </Text>
            </Box>
            <Box>
              <Link href="/">
                <StyledLink
                  variant="text.activeLink"
                  sx={{
                    fontFamily: 'QuiteMagicalRegular, Poppins',
                    fontSize: '36px',
                  }}
                >
                  Roll With Me
                </StyledLink>
              </Link>
            </Box>
          </Box>
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
