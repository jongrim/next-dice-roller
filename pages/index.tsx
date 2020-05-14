import * as React from 'react';
import Router from 'next/router';
import Head from 'next/head';
import { Box, Button, Flex, Heading, Image } from 'rebass';

export default function Home() {
  return (
    <Box bg="background">
      <Head>
        <title>Roll Together</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Flex flexDirection="column" alignItems="center">
          <Heading as="h1" fontSize={[5, 6, 7]}>
            Roll With Me
          </Heading>
          <Flex justifyContent="center">
            <Image
              src="/roller_1.svg"
              alt="Person eager to roll dice"
              sx={{ width: '25%' }}
            />
            <Image
              src="/roller_2.svg"
              alt="Person eager to roll dice"
              sx={{ width: '25%' }}
            />
          </Flex>
          <Button
            variant="primary"
            mt={2}
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
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }
      `}</style>
    </Box>
  );
}
