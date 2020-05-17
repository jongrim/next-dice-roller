import * as React from 'react';
import { Flex, Heading } from 'rebass';
import { DiceState } from '../types/dice';

const RollResultsTable = ({ roll }: { roll: DiceState }) => {
  return (
    <Flex flexWrap="wrap" justifyContent="space-between">
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
            </Flex>
          );
        }
        return null;
      })}
    </Flex>
  );
};

export default RollResultsTable;
