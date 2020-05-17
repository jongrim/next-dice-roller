import * as React from 'react';
import { Box } from 'rebass';
import RollBubble from './RollBubble';
import { DiceState } from '../types/dice';

const RollBubbleManager = ({ rolls }: { rolls: DiceState[] }) => {
  return (
    <Box sx={{ position: 'absolute', bottom: '50px', right: '50px' }}>
      {rolls.map((roll, i) => (
        <RollBubble key={`${roll.roller}-roll-${i}`} roll={roll} />
      ))}
    </Box>
  );
};

export default RollBubbleManager;
