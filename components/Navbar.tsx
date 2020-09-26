import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Box, Button, Flex, Text } from 'rebass';
import { Switch } from '@rebass/forms';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from 'react-tippy';

import HomeSvg from './HomeSvg';
import CopySvg from './CopyUrlSvg';
import ConnectedSvg from './ConnectedSvg';
import NotConnectedSvg from './NotConnectedSvg';
import AboutSvg from './AboutSvg';

const Navbar = ({ connected, connectedUsers, name, toggleTheme, theme }) => {
  return (
    <Flex
      height="60px"
      width="100%"
      px={3}
      bg="background"
      justifyContent="flex-end"
      alignItems="center"
      sx={(style) => ({
        borderBottom: `1px ${style.colors.text} solid`,
      })}
    >
      <Box mr="auto">
        <Link href="/">
          <a href="/" target="_blank">
            <HomeSvg />
          </a>
        </Link>
      </Box>
      <Switch
        mr={3}
        onClick={toggleTheme}
        color="text"
        sx={{
          borderColor: 'text',
          borderWidth: '2px',
          '& > div': {
            marginTop: '-2px',
            marginLeft: '-2px',
            borderColor: 'text',
            borderWidth: '2px',
          },
          '&[aria-checked=true]': {
            backgroundColor: 'transparent',
          },
        }}
        checked={theme.label === 'dark'}
      />
      <Tooltip arrow title="Copy room URL">
        <CopyToClipboard text={`https://rollwithme.xyz/room/${name}`}>
          <Button variant="clear" onClick={() => {}}>
            <CopySvg />
          </Button>
        </CopyToClipboard>
      </Tooltip>
      <Box px={3}>
        <Tooltip
          arrow
          html={
            connected ? (
              <Flex flexDirection="column">
                <Text>Connected Users</Text>
                {connectedUsers.map((user) => (
                  <Text key={user.id}>{user.username}</Text>
                ))}
              </Flex>
            ) : (
              <Flex flexDirection="column" maxWidth="128px">
                <Text>Not connected</Text>
                <Text>Click the icon to make a new room</Text>
              </Flex>
            )
          }
        >
          {connected ? (
            <ConnectedSvg />
          ) : (
            <Button
              variant="clear"
              onClick={() => {
                window
                  .fetch('/api/new-room', { method: 'POST' })
                  .then((res) => res.json())
                  .then(({ name }) => {
                    Router.push(`/room/${name}`);
                  });
              }}
            >
              <NotConnectedSvg />
            </Button>
          )}
        </Tooltip>
      </Box>
      <Box pl={3}>
        <Tooltip arrow title="About">
          <Link href="/about">
            <a href="/about" target="_blank">
              <AboutSvg />
            </a>
          </Link>
        </Tooltip>
      </Box>
    </Flex>
  );
};

export default Navbar;
