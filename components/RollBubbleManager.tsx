import * as React from 'react';
import { Flex } from 'rebass';
import RollBubble from './RollBubble';
import { DiceState } from '../types/dice';

const RollBubbleManager = ({ rolls }: { rolls: DiceState[] }) => {
  return (
    <Flex
      sx={{ position: 'absolute', bottom: '15px', right: '50px' }}
      flexDirection="column-reverse"
    >
      {rolls.map((roll, i) => (
        <RollBubble key={`${roll.id}`} roll={roll} />
      ))}
    </Flex>
  );
};

export default RollBubbleManager;
