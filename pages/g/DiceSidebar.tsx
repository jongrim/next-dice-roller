import * as React from 'react';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import { TweenMax, Elastic } from 'gsap';
import { Box, Flex } from 'rebass';
import { Icon, InlineIcon } from '@iconify/react';
import diceD4Outline from '@iconify/icons-mdi/dice-d4-outline';
import diceD6Outline from '@iconify/icons-mdi/dice-d6-outline';
import diceD8Outline from '@iconify/icons-mdi/dice-d8-outline';
import diceD10Outline from '@iconify/icons-mdi/dice-d10-outline';
import diceD12Outline from '@iconify/icons-mdi/dice-d12-outline';
import diceD20Outline from '@iconify/icons-mdi/dice-d20-outline';

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
  initial: 'open',
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
      entry: ['setToggleIconOff'],
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
      entry: ['setToggleIconOn'],
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

function DiceSidebar() {
  const element = React.useRef(null);
  const openMenu = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenMax.to(element.current || {}, 0.5, {
        left: 0,
        backdropFilter: 'blur(5px)',
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);
  const closeMenu = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenMax.to(element.current || {}, 0.5, {
        left: -200,
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
      className="sidebar"
      ref={element}
      width={100}
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
    >
      <Icon height="3rem" icon={diceD4Outline} />
      <Icon height="3rem" icon={diceD6Outline} />
      <Icon height="3rem" icon={diceD8Outline} />
      <Icon height="3rem" icon={diceD10Outline} />
      <Icon height="3rem" icon={diceD12Outline} />
      <Icon height="3rem" icon={diceD20Outline} />
    </Flex>
  );
}

export default DiceSidebar;
