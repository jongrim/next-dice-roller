import * as React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { Box, Button, Flex, Heading, Image, Text } from 'rebass';
import Footer from '../components/Footer';

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
      <Flex as="main" flexDirection="column" flex="1" pb={2} bg="background">
        <Flex
          mt={5}
          px={2}
          justifyContent="center"
          alignItems="center"
          flexDirection={['column', 'column', 'row']}
        >
          <Box maxWidth="380px" sx={{ order: [2, 2, 1] }}>
            <Heading color="text" as="h1" fontSize={[5, 6, 6]}>
              Roll With Me
            </Heading>
            <Text>
              Create a new room and share the URL with your friends to roll dice
              together online
            </Text>
          </Box>
          <Image
            src="/roller_2.svg"
            alt="Person eager to roll dice"
            minWidth="140px"
            sx={{ width: '15%', order: [1, 1, 2] }}
          />
        </Flex>
        <Flex alignItems="center" flexDirection="column" my={3} px={3}>
          <Text fontWeight="bold" as="h2">
            Black Lives Matter
          </Text>
          <Text>
            Please support initiatives like the{' '}
            <a href="https://eji.org/">Equal Justice Initiative</a>
          </Text>
        </Flex>
        <Flex justifyContent="center" alignItems="center" mt={1}>
          <Button
            variant="primary"
            height="3rem"
            onClick={() => {
              window
                .fetch('/api/new-room', { method: 'POST' })
                .then((res) => res.json())
                .then(({ name }) => {
                  Router.push(`/room/${name}`);
                });
            }}
          >
            Make a new room
          </Button>
          <Button
            ml={2}
            variant="primary"
            height="3rem"
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
        </Flex>
      </Flex>
      <Footer />
    </>
  );
}
