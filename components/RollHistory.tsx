import * as React from 'react';
import { Box, Flex, Heading, Text } from 'rebass';
import { Tooltip } from 'react-tippy';
import { Roll } from '../types/dice';
import { rollTotal } from '../utils/rollMath';

const RollHistory: React.FC<{ rolls: Roll[] }> = ({ rolls }) => {
  return (
    <Box
      flex="1 0 0%"
      minHeight="0"
      maxHeight={['80vh', '100vh', '100vh']}
      mt={[2, 2, 0]}
      pt={[2, 2, 0]}
    >
      <Heading color="text" as="h2" textAlign="center" fontWeight="600">
        Rolls Since Joining
      </Heading>
      <Flex
        sx={(styles) => ({ borderBottom: `1px ${styles.colors.text} solid` })}
      >
        <Text color="text" textAlign="center" width={1 / 3}>
          Roller
        </Text>
        <Text color="text" textAlign="center" width={1 / 3}>
          Roll Name
        </Text>
        <Text color="text" textAlign="center" width={1 / 3}>
          Roll Total
        </Text>
      </Flex>
      <Box
        flex="1"
        minHeight="0"
        height={['60vh', '90vh', '80vh']}
        sx={(styles) => ({
          overflow: 'scroll',
          borderBottom: `1px ${styles.colors.muted} solid`,
        })}
      >
        {rolls.map((roll, i) => (
          <Tooltip
            arrow
            key={`roll-${roll.id}`}
            theme="light"
            style={{ display: 'inherit' }}
            html={
              <Box
                data-testid={`roll-history-popup-${i}`}
                sx={{ overflow: 'scroll' }}
              >
                {Object.entries(roll.dice).map(([key, val], i) => {
                  if (val.results.length > 0) {
                    return (
                      <Box key={`rollHistory-${roll.id}-${i}`}>
                        <Text color="text" fontSize={2}>
                          {key}
                        </Text>
                        <Flex alignItems="center">
                          <Text color="text" key={`${key}-${i}`}>
                            {key === 'coin'
                              ? val.results[0] % 2 === 0
                                ? 'Heads'
                                : 'Tails'
                              : val.results
                                  .map((num) => (num % val.sides) + 1)
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
                    <Text color="text">Roll Modifier</Text>
                    <Text color="text">{roll.modifier}</Text>
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
                <Text color="text" textAlign="center" width={1 / 3}>
                  {roll.roller}
                </Text>
                <Text color="text" textAlign="center" width={1 / 3}>
                  {roll.name}
                </Text>
                <Text color="text" textAlign="center" width={1 / 3}>
                  {roll.name === 'coin flip'
                    ? roll.dice.coin?.results[0] % 2 === 0
                      ? 'Heads'
                      : 'Tails'
                    : rollTotal(roll)}
                </Text>
              </Flex>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default RollHistory;
