import * as React from 'react';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import { TweenMax, Elastic } from 'gsap';
import { Box, Card, Flex, Text } from 'rebass';
import { DiceState } from '../types/dice';

interface RollBubbleMachineSchema {
  states: {
    invisible: {};
    hiding: {};
    visible: {};
    showing: {};
  };
}

type RollBubbleEvent = { type: 'SHOW' } | { type: 'HIDE' };

const RollBubbleMachine = Machine<RollBubbleMachineSchema, RollBubbleEvent>({
  id: 'rollBubble',
  initial: 'showing',
  states: {
    invisible: {
      type: 'final',
    },
    hiding: {
      invoke: {
        src: 'hide',
        onDone: {
          target: 'invisible',
        },
      },
    },
    showing: {
      invoke: {
        src: 'show',
        onDone: {
          target: 'visible',
        },
      },
    },
    visible: {
      after: {
        5000: 'hiding',
      },
    },
  },
});

const RollBubble = ({ roll }: { roll: DiceState }) => {
  const element = React.useRef(null);
  const show = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenMax.to(element.current || {}, 0.5, {
        visibility: 'visible',
        y: -25,
        backdropFilter: 'blur(2px)',
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);
  const hide = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenMax.to(element.current || {}, 0.5, {
        display: 'none',
        visibility: 'hidden',
        backdropFilter: 'blur(0px)',
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);

  useMachine(RollBubbleMachine, {
    services: {
      show,
      hide,
    },
  });

  let rollName = '';
  if (roll.name) {
    rollName += ` ${roll.name}`;
  }

  return (
    <Card ref={element} sx={{ visibility: 'hidden' }} my={2}>
      <Flex alignItems="center">
        <Box bg="background" data-testid={`roll-bubble-${roll.name}`}>
          <Text color="text" fontWeight="bold">
            {roll.roller}
          </Text>
          <Text
            color="text"
            data-testid="roll-bubble-roll-name"
          >{` rolled${rollName}!`}</Text>
        </Box>
      </Flex>
    </Card>
  );
};

export default RollBubble;
