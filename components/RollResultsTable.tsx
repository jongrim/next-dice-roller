import * as React from 'react';
import { Flex, Heading, Text } from 'rebass';
import { DiceState } from '../types/dice';
import { rollTotal } from '../utils/rollMath';

const RollResultsTable = ({ roll }: { roll: DiceState }) => {
  return (
    <Flex
      as="section"
      data-testid="roll-results-column"
      flexDirection="column"
      alignItems="center"
      flex="1 0 0%"
    >
      <Heading as="h2">Results</Heading>
      <Flex flexWrap="wrap" justifyContent="space-around">
        {Object.entries(roll.dice).map(([key, val], i) => {
          if (val.dice.length > 0) {
            return (
              <Flex
                key={`roll-${roll.id}-${i}`}
                flexDirection="column"
                alignItems="center"
                minWidth={128}
              >
                <Heading as="h3">{key}</Heading>
                <Text data-testid={`dice-results-${key}`} fontSize={3}>
                  {val.dice
                    .map((num) => (num % parseInt(key.substr(1), 10)) + 1)
                    .join(' + ')}
                </Text>
                <Text
                  fontSize={3}
                  mt={1}
                  pt={1}
                  sx={(styles) => ({
                    borderTop: `1px ${styles.colors.text} solid`,
                  })}
                >
                  {val.dice.reduce((sum, cur) => {
                    const num = (cur % parseInt(key.substr(1), 10)) + 1;
                    return sum + num;
                  }, 0)}
                </Text>
              </Flex>
            );
          }
          return null;
        })}
      </Flex>
      {roll.modifier && (
        <Flex flexDirection="column" alignItems="center" minWidth={128} mt={2}>
          <Heading as="h3">Roll Modifier</Heading>
          <Text fontSize={3}>{roll.modifier}</Text>
        </Flex>
      )}
      <Flex flexDirection="column" alignItems="center" minWidth={128} mt={2}>
        <Heading as="h3">Total</Heading>
        <Text fontSize={3}>{rollTotal(roll)}</Text>
      </Flex>
    </Flex>
  );
};

export default RollResultsTable;
