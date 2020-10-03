import * as React from 'react';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { Tooltip } from 'react-tippy';
import gsap, { Elastic } from 'gsap';
import { GraphicDie } from '../types/dice';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import Icon from '@iconify/react';
import chevronDoubleLeft from '@iconify/icons-mdi-light/chevron-double-left';
import chevronDoubleRight from '@iconify/icons-mdi-light/chevron-double-right';

interface SidebarMachineSchema {
  states: {
    closed: {};
    closing: {};
    open: {};
    opening: {};
  };
}

type SidebarEvent = { type: 'OPEN' } | { type: 'CLOSE' };

const SidebarMachine = Machine<SidebarMachineSchema, SidebarEvent>({
  id: 'sidebar',
  initial: 'closed',
  states: {
    closed: {
      on: {
        OPEN: { target: 'opening' },
      },
    },
    closing: {
      on: {
        OPEN: { target: 'opening' },
      },
      invoke: {
        src: 'closeMenu',
        onDone: {
          target: 'closed',
        },
      },
    },
    opening: {
      on: {
        CLOSE: { target: 'closing' },
      },
      invoke: {
        src: 'openMenu',
        onDone: {
          target: 'open',
        },
      },
    },
    open: {
      on: {
        CLOSE: { target: 'closing' },
      },
    },
  },
});

const nextMessageMap: { [key: string]: SidebarEvent } = {
  closed: { type: 'OPEN' },
  closing: { type: 'OPEN' },
  open: { type: 'CLOSE' },
  opening: { type: 'CLOSE' },
};

interface Props {
  rolls: { roller: string; total: number; dice: GraphicDie[] }[];
}

const GraphicRollHistory = ({ rolls }: Props): React.ReactElement => {
  const element = React.useRef(null);
  const openMenu = React.useCallback(() => {
    return new Promise((resolve) => {
      gsap.to(element.current || {}, {
        duration: 0.25,
        right: 0,
        backdropFilter: 'blur(5px)',
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);
  const closeMenu = React.useCallback(() => {
    return new Promise((resolve) => {
      gsap.to(element.current || {}, {
        duration: 0.25,
        right: -200,
        backdropFilter: 'blur(0px)',
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);

  const [current, send] = useMachine(SidebarMachine, {
    services: {
      openMenu,
      closeMenu,
    },
  });

  const nextMessage: SidebarEvent = nextMessageMap[current.value.toString()];
  return (
    <Flex
      sx={{
        position: 'absolute',
        right: -200,
        top: 0,
      }}
      height="100%"
      width="232px"
      ref={element}
    >
      <Flex flexDirection="column" justifyContent="center" flex="0 0 32px">
        <Button
          variant="ghost"
          sx={{ border: 'none' }}
          p={0}
          onClick={() => send(nextMessage)}
        >
          <Icon
            icon={
              current.value === 'closed'
                ? chevronDoubleLeft
                : chevronDoubleRight
            }
            width="2rem"
          />
        </Button>
      </Flex>
      <Flex flexDirection="column" alignItems="stretch" flex="1 0 200px">
        <Heading color="text" as="h2" textAlign="center" fontWeight="600">
          Rolls
        </Heading>
        <Flex
          sx={(styles) => ({ borderBottom: `1px ${styles.colors.text} solid` })}
        >
          <Text color="text" textAlign="center" width={1 / 2}>
            Roller
          </Text>
          <Text color="text" textAlign="center" width={1 / 2}>
            Roll Total
          </Text>
        </Flex>
        <Box
          flex="1"
          minHeight="0"
          height="80vh"
          sx={(styles) => ({
            overflow: 'scroll',
            borderBottom: `1px ${styles.colors.muted} solid`,
          })}
        >
          {rolls.map((roll, i) => (
            <Tooltip
              arrow
              key={`roll-${i}`}
              theme="light"
              style={{ display: 'inherit' }}
              html={
                <Box data-testid={`roll-history-popup-${i}`}>
                  <Text>
                    {roll.dice.map(({ curNumber }) => curNumber).join(', ')}
                  </Text>
                </Box>
              }
            >
              <Box data-testid={`roll-history-item-${i}`}>
                <Flex
                  py={2}
                  sx={{
                    cursor: 'pointer',
                    ':hover': { backgroundColor: 'muted' },
                  }}
                >
                  <Text color="text" textAlign="center" width={1 / 2}>
                    {roll.roller}
                  </Text>
                  <Text color="text" textAlign="center" width={1 / 2}>
                    {roll.total}
                  </Text>
                </Flex>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Flex>
    </Flex>
  );
};

export default GraphicRollHistory;
