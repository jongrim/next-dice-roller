import * as React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { Box, Button, Flex, Heading, Image, Text } from 'rebass';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Roll Together</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="main" flexDirection="column" flex="1">
        <Flex
          mt={5}
          justifyContent="center"
          alignItems="center"
          flexDirection={['column', 'column', 'row']}>
          <Box
            width={['380px']}
            sx={{ order: [2, 2, 1] }}
            textAlign={['center', 'center', 'left']}>
            <Heading as="h1" fontSize={[5, 6, 7]}>
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
        <Flex justifyContent="center" alignItems="center">
          <Button
            variant="primary"
            mt={4}
            minWidth="250px"
            width="33%"
            height="3rem"
            onClick={() => {
              window
                .fetch('/api/new-room', { method: 'POST' })
                .then((res) => res.json())
                .then(({ name }) => {
                  Router.push(`/room/${name}`);
                });
            }}>
            Make a new room
          </Button>
        </Flex>
      </Flex>
      <Footer />
    </>
  );
}
