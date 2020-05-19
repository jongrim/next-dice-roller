import * as React from 'react';
import { Box, Flex, Heading, Text } from 'rebass';
import { Tooltip } from 'react-tippy';
import { DiceState } from '../types/dice';
import { rollTotal } from '../utils/rollMath';

const RollHistory: React.FC<{ rolls: DiceState[] }> = ({ rolls }) => {
  return (
    <Flex flexDirection="column" flex="1">
      <Flex
        sx={(styles) => ({ borderBottom: `1px ${styles.colors.text} solid` })}
        mb={2}
      >
        <Box width={1 / 3}>Roller</Box>
        <Box width={1 / 3}>Roll Name</Box>
        <Box width={1 / 3}>Roll Total</Box>
      </Flex>
      {rolls.map((roll) => (
        <Tooltip
          arrow
          key={`roll-${roll.id}`}
          trigger="click"
          theme="light"
          html={
            <Box sx={{ overflow: 'scroll' }}>
              {Object.entries(roll.dice).map(([key, val], i) => {
                if (val.dice.length > 0) {
                  return (
                    <Box key={`rollHistory-${roll.id}-${i}`}>
                      <Text fontSize={2}>{key}</Text>
                      <Flex alignItems="center">
                        <Text key={`${key}-${i}`}>
                          {val.dice
                            .map(
                              (num) =>
                                (num % parseInt(key.substr(1, 1), 10)) + 1
                            )
                            .join(', ')}
                        </Text>
                      </Flex>
                    </Box>
                  );
                }
                return null;
              })}
              {roll.modifier && (
                <Box>
                  <Text>Roll Modifier</Text>
                  <Text>{roll.modifier}</Text>
                </Box>
              )}
            </Box>
          }
        >
          <Flex mb={1}>
            <Box width={1 / 3}>{roll.roller}</Box>
            <Box width={1 / 3}>{roll.name}</Box>
            <Box width={1 / 3}>{rollTotal(roll)}</Box>
          </Flex>
        </Tooltip>
      ))}
    </Flex>
  );
};

export default RollHistory;
