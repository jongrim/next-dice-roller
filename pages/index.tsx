import * as React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { Box, Button, Card, Flex, Heading, Image, Link, Text } from 'rebass';
import Footer from '../components/Footer';
import styles from './indexStyles.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Roll With Me</title>
        <meta
          name="description"
          content="Roll dice with friends using an easy web application where everyone can see the results in real time."
        />
      </Head>
      <Flex
        as="main"
        flexDirection="column"
        flex="1"
        bg="background"
        width="100%"
      >
        <Flex
          alignItems="center"
          flexDirection="column"
          px={3}
          pb={2}
          backgroundColor="text"
        >
          <Text fontWeight="600" as="h2" color="background">
            Black Lives Matter
          </Text>
          <Text color="background" textAlign="center">
            Please support initiatives like the{' '}
            <Link href="https://eji.org/" color="background">
              Equal Justice Initiative
            </Link>
          </Text>
        </Flex>
        <Box height={['740px', '740px', '640px']}>
          <Flex
            height="100%"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Flex
              justifyContent="center"
              alignItems="center"
              flexDirection={['column', 'column', 'row']}
              mb={3}
            >
              <Box
                maxWidth="380px"
                sx={{
                  order: [2, 2, 1],
                  textAlign: ['center', 'center', 'start'],
                }}
                pr={[0, 0, 3]}
              >
                <Heading
                  color="text"
                  as="h1"
                  fontSize="82px"
                  fontWeight="400"
                  fontFamily="QuiteMagicalRegular, Poppins"
                >
                  Roll With Me
                </Heading>
                <Text color="text">
                  Create a new room and share the URL with your friends to roll
                  dice together online
                </Text>
              </Box>
              <Image
                src="/roller_2.svg"
                alt="Person eager to roll dice"
                width="180px"
                sx={{ order: [1, 1, 2] }}
              />
            </Flex>
            <Flex
              width={['100%', '100%', '100%', '800px']}
              justifyContent={['center', 'space-around', 'space-between']}
              alignItems="center"
              flexDirection={['column', 'column', 'column', 'row']}
            >
              <Button
                width="220px"
                variant="primary"
                height="3rem"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  window
                    .fetch('/api/new-room', { method: 'POST' })
                    .then((res) => res.json())
                    .then(({ name }) => {
                      Router.push(`/room/${name}`);
                    });
                }}
              >
                Make a new text room
              </Button>
              <Button
                width="220px"
                mt={[3, 3, 3, 0]}
                variant="ghost"
                height="3rem"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  window
                    .fetch('/api/new-room', { method: 'POST' })
                    .then((res) => res.json())
                    .then(({ name }) => {
                      Router.push(`/g/${name}`);
                    });
                }}
              >
                Make a new interactive room (BETA)
              </Button>
              <Button
                width="220px"
                mt={[3, 3, 3, 0]}
                backgroundColor="hsl(0, 7%, 10%)"
                color="white"
                height="3rem"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  window
                    .fetch('/api/new-room', { method: 'POST' })
                    .then((res) => res.json())
                    .then(({ name }) => {
                      Router.push(`/trophy-dark/${name}`);
                    });
                }}
              >
                Make a new Trophy Dark room
              </Button>
            </Flex>
          </Flex>
        </Box>
        <Box
          height="640px"
          className={styles.wave}
          sx={{
            display: 'grid',
            gridGap: 2, // theme.space[3]
            gridTemplateColumns: ['1fr', '1fr', '1fr 1fr'],
            gridTemplateRows: ['1fr 1fr', '0.75fr 1fr', '1fr'],
          }}
        >
          <Flex
            sx={{
              gridColumn: ['1', '1', '1 / 2'],
              gridRow: ['1', '1', '1'],
            }}
            flexDirection="column"
            justifyContent="center"
            px={2}
            py={[2, 2, 0]}
          >
            <Heading
              as="h3"
              color="background"
              fontWeight="200"
              alignSelf="center"
            >
              Text Dice Rooms
            </Heading>
            <ul color="background">
              <li className={styles.list}>
                <Text color="background">Create, save, and reuse rolls</Text>
              </li>
              <li className={styles.list}>
                <Text color="background">
                  Build rolls on the fly, and give them a modifier and name
                </Text>
              </li>
              <li className={styles.list}>
                <Text color="background">
                  See a history of rolls, complete with breakdown of values on
                  each die type
                </Text>
              </li>
              <li className={styles.list}>
                <Text color="background">Light and dark mode themes</Text>
              </li>
              <li className={styles.list}>
                <Text color="background">
                  Responsive design for smaller devices
                </Text>
              </li>
            </ul>
          </Flex>
          <Flex
            sx={{
              gridColumn: ['1', '1', '2'],
              gridRow: ['2', '2', '1'],
            }}
            px={3}
            py={[2, 2, 0]}
            justifyContent="center"
            alignItems="center"
          >
            <video
              id="text-room-features"
              className={styles.video}
              src="/TextRoomFeatures.mp4"
              typeof="video/mp4"
              autoPlay
              loop
              muted
              playsInline
              onPlay={() => {
                const el = document.getElementById(
                  'text-room-features'
                ) as HTMLMediaElement;
                el.playbackRate = 1.6;
              }}
            />
          </Flex>
        </Box>
        <Box
          height="640px"
          backgroundColor="hsl(0, 0%, 15%)"
          color="hsl(37, 10%, 85%)"
          sx={{
            display: 'grid',
            gridGap: 2, // theme.space[3]
            gridTemplateColumns: [
              '1fr',
              '1fr',
              'minmax(500px, 1fr) 300px',
              'minmax(650px, 1fr) 1fr',
            ],
            gridTemplateRows: ['360px 1fr', '360px 1fr', '1fr', '1fr'],
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          <Image
            src="/TrophyDarkCharacter.png"
            alt="example trophy dark character"
            width={['315px', '440px', '500px', '550px']}
            // height={['215px', '340px', '300px', '400px']}
            sx={{
              boxShadow: `0 2.8px 2.2px rgba(0, 0, 0, 0.02),
                            0 6.7px 5.3px rgba(0, 0, 0, 0.028),
                            0 12.5px 10px rgba(0, 0, 0, 0.035),
                            0 22.3px 17.9px rgba(0, 0, 0, 0.042),
                            0 41.8px 33.4px rgba(0, 0, 0, 0.05),
                            0 100px 80px rgba(0, 0, 0, 0.07)`,
            }}
          />
          <Flex
            flexDirection="column"
            justifyContent="center"
            pr={4}
            py={[2, 2, 0]}
          >
            <Heading
              as="h3"
              color="background"
              fontWeight="200"
              alignSelf="center"
            >
              Trophy Dark
            </Heading>
            <ul>
              <li className={styles.list}>
                <Text color="background">
                  Full featured application with character sheets, dice roller,
                  and safety tools
                </Text>
              </li>
              <li className={styles.list}>
                <Text color="background">
                  Separate GM and Player roles give the user access to the tools
                  they need to play
                </Text>
              </li>
              <li className={styles.list}>
                <Text color="background">
                  Full Trophy SRD included for quick reference
                </Text>
              </li>
            </ul>
          </Flex>
        </Box>
      </Flex>
      <Footer />
    </>
  );
}
