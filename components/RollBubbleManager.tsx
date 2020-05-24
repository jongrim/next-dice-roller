import * as React from 'react';
import { Flex } from 'rebass';
import RollBubble from './RollBubble';
import { DiceState } from '../types/dice';

const RollBubbleManager = ({ rolls }: { rolls: DiceState[] }) => {
  return (
    <Flex
      data-testid="roll-bubbles"
      sx={{
        position: 'absolute',
        top: ['280px', 'auto', 'auto'],
        left: ['5px', 'auto', 'auto'],
        bottom: ['auto', '15px', '15px'],
        right: ['auto', '50px', '50px'],
      }}
      flexDirection="column-reverse"
    >
      {rolls.map((roll, i) => (
        <RollBubble key={`${roll.id}`} roll={roll} />
      ))}
    </Flex>
  );
};

export default RollBubbleManager;
