import * as React from 'react';
import { Box, Flex, Heading, Text } from 'rebass';
import { Tooltip } from 'react-tippy';
import { DiceState } from '../types/dice';
import { rollTotal } from '../utils/rollMath';

const RollHistory: React.FC<{ rolls: DiceState[] }> = ({ rolls }) => {
  return (
    <Flex
      flexDirection="column"
      flex="1 0 0%"
      minHeight="0"
      maxHeight="100vh"
      sx={(styles) => ({
        borderTop: [`1px ${styles.colors.text} solid`, 'none', 'none'],
      })}
      mt={[2, 2, 0]}
      pt={[2, 2, 0]}
    >
      <Heading as="h2" textAlign="center">
        Rolls Since Joining
      </Heading>
      <Flex
        sx={(styles) => ({ borderBottom: `1px ${styles.colors.text} solid` })}
      >
        <Text textAlign="center" width={1 / 3}>
          Roller
        </Text>
        <Text textAlign="center" width={1 / 3}>
          Roll Name
        </Text>
        <Text textAlign="center" width={1 / 3}>
          Roll Total
        </Text>
      </Flex>
      <Box flex="1" minHeight="0" height="100%" sx={{ overflow: 'scroll' }}>
        {rolls.map((roll, i) => (
          <Tooltip
            arrow
            key={`roll-${roll.id}`}
            theme="light"
            position="bottom"
            distance={-30}
            trigger="click"
            html={
              <Box
                data-testid={`roll-history-popup-${i}`}
                sx={{ overflow: 'scroll' }}
              >
                {Object.entries(roll.dice).map(([key, val], i) => {
                  if (val.dice.length > 0) {
                    return (
                      <Box key={`rollHistory-${roll.id}-${i}`}>
                        <Text fontSize={2}>{key}</Text>
                        <Flex alignItems="center">
                          <Text key={`${key}-${i}`}>
                            {val.dice
                              .map(
                                (num) => (num % parseInt(key.substr(1), 10)) + 1
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
            <Box data-testid={`roll-history-item-${i}`}>
              <Flex
                py={2}
                sx={{
                  cursor: 'pointer',
                  ':hover': { backgroundColor: 'muted' },
                }}
              >
                <Text textAlign="center" width={1 / 3}>
                  {roll.roller}
                </Text>
                <Text textAlign="center" width={1 / 3}>
                  {roll.name}
                </Text>
                <Text textAlign="center" width={1 / 3}>
                  {rollTotal(roll)}
                </Text>
              </Flex>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Flex>
  );
};

export default RollHistory;
