import * as React from 'react';
import { Flex, Heading, Text } from 'rebass';
import { DiceState } from '../types/dice';

const RollResultsTable = ({ roll }: { roll: DiceState }) => {
  return (
    <Flex flexWrap="wrap" justifyContent="space-around">
      {Object.entries(roll.dice).map(([key, val]) => {
        if (val.dice.length > 0) {
          return (
            <Flex
              flexDirection="column"
              alignItems="center"
              minWidth={128}
              height={128}>
              <Heading as="h3">{key}</Heading>
              {val.dice.map((num, i) => (
                <p key={`${key}-${i}`}>
                  {(num % parseInt(key.substr(1, 1), 10)) + 1}
                </p>
              ))}
              <Text
                mt={1}
                pt={1}
                sx={(styles) => ({
                  borderTop: `1px ${styles.colors.text} solid`,
                })}>
                {val.dice.reduce((sum, cur) => {
                  const num = (cur % parseInt(key.substr(1, 1), 10)) + 1;
                  return sum + num;
                }, 0)}
                {roll.modifier ? ` + ${roll.modifier}` : ''}
              </Text>
            </Flex>
          );
        }
        return null;
      })}
    </Flex>
  );
};

export default RollResultsTable;
