import React, { ReactChild, useCallback, useRef } from 'react';
import { Box, Button, Flex, Image } from 'rebass';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import { TweenMax, Elastic } from 'gsap';

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

function Sidebar({ children }: { children: ReactChild | ReactChild[] }) {
  const element = useRef(null);
  const openMenu = useCallback(() => {
    return new Promise((resolve) => {
      TweenMax.to(element.current || {}, 0.5, {
        visibility: 'visible',
        x: 0,
        backdropFilter: 'blur(2px)',
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);
  const closeMenu = useCallback(() => {
    return new Promise((resolve) => {
      TweenMax.to(element.current || {}, 0.5, {
        visibility: 'hidden',
        x: -375,
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
      flexDirection="column"
      height="100%"
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: current.value === 'closed' ? -1 : 1,
      }}>
      <Button
        onClick={() => send(nextMessage)}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 2,
          backgroundColor: 'transparent',
        }}>
        <Image src="/menu.svg" alt="toggle menu" />
      </Button>
      <Box
        height="100%"
        width="350px"
        ref={element}
        pt="50px"
        px={2}
        bg="muted"
        sx={{
          visibility: 'hidden',
          transform: `translate(-375px, 0px)`,
          boxShadow: `0 0px 2.2px rgba(0, 0, 0, 0.042),
  0 0px 5.3px rgba(0, 0, 0, 0.061),
  0 0px 10px rgba(0, 0, 0, 0.075),
  0 0px 17.9px rgba(0, 0, 0, 0.089),
  0 0px 33.4px rgba(0, 0, 0, 0.108),
  0 0px 80px rgba(0, 0, 0, 0.15)`,
        }}>
        <Flex flexDirection="column" width="100%" height="100%">
          {children}
        </Flex>
      </Box>
    </Flex>
  );
}

export default Sidebar;
