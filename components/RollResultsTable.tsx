import * as React from 'react';
import { Box, Flex, Heading, Image, Text } from 'rebass';
import { Label, Select } from '@rebass/forms';
import { Tooltip } from 'react-tippy';
import { DiceState } from '../types/dice';
import { rollTotal } from '../utils/rollMath';

type modes = 'sum' | 'list';

const modes: { [key: string]: modes } = {
  sum: 'sum',
  list: 'list',
};

const diceDisplayString = (mode: modes, dice: number[]): string => {
  switch (mode) {
    case 'sum':
      return dice.join(' + ');
    case 'list':
      return dice.join(', ');
  }
};

const RollResultsTable = ({ roll }: { roll: DiceState }) => {
  const [mode, setMode] = React.useState<modes>(modes.sum);

  return (
    <Flex
      data-testid="roll-results-column"
      flexDirection="column"
      alignItems="center"
      flex="1 0 0%"
      minHeight="265px"
    >
      <Flex>
        <Heading as="h2" mr={2}>
          Results
        </Heading>
        <Tooltip
          interactive
          trigger="click"
          title="test"
          tabIndex={0}
          html={
            <Flex as="form" flexDirection="column" width="180px">
              <Label htmlFor="results-mode">Display Mode</Label>
              <Select
                name="results-mode"
                id="results-mode"
                value={mode}
                onChange={(e) => {
                  const { value } = e.target;
                  if (modes[value]) {
                    setMode(modes[value]);
                  }
                }}
              >
                <option value={modes.sum}>Sum - add dice</option>
                <option value={modes.list}>List - do not add dice</option>
              </Select>
            </Flex>
          }
        >
          <Image
            alignSelf="flex-start"
            src="/settings.svg"
            alt="roll results settings"
            width="18px"
            sx={{
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      </Flex>
      <Flex flexWrap="wrap" justifyContent="space-around">
        {Object.entries(roll.dice).map(([key, val], i) => {
          if (val.dice.length > 0) {
            return (
              <Flex
                key={`roll-${roll.id}-${i}`}
                flexDirection="column"
                alignItems="center"
                minWidth={90}
              >
                <Heading as="h3">{key}</Heading>
                <Text data-testid={`dice-results-${key}`} fontSize={3}>
                  {diceDisplayString(
                    mode,
                    val.dice.map(
                      (num) => (num % parseInt(key.substr(1), 10)) + 1
                    )
                  )}
                </Text>
                {mode === modes.sum && (
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
                )}
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
      {mode === modes.sum && (
        <Flex flexDirection="column" alignItems="center" minWidth={128} mt={2}>
          <Heading as="h3">Total</Heading>
          <Text fontSize={3}>{rollTotal(roll)}</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default RollResultsTable;
