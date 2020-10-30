import * as React from 'react';
import { Box, Button, Flex } from 'rebass';
import { Input, Label } from '@rebass/forms';

import dice1Outline from '@iconify/icons-mdi/dice-1-outline';
import dice2Outline from '@iconify/icons-mdi/dice-2-outline';
import dice3Outline from '@iconify/icons-mdi/dice-3-outline';
import dice4Outline from '@iconify/icons-mdi/dice-4-outline';
import dice5Outline from '@iconify/icons-mdi/dice-5-outline';
import dice6Outline from '@iconify/icons-mdi/dice-6-outline';

import dice1 from '@iconify/icons-mdi/dice-1';
import dice2 from '@iconify/icons-mdi/dice-2';
import dice3 from '@iconify/icons-mdi/dice-3';
import dice4 from '@iconify/icons-mdi/dice-4';
import dice5 from '@iconify/icons-mdi/dice-5';
import dice6 from '@iconify/icons-mdi/dice-6';
import Icon from '@iconify/react';
import { useTheme } from 'emotion-theming';

interface DiceState {
  lightDice: number[];
  darkDice: number[];
}

type diceEvents = {
  type: 'roll';
  payload: {
    lightResults: number[];
    darkResults: number[];
  };
};

const initialDiceState: DiceState = {
  lightDice: [],
  darkDice: [],
};

const getD6Result = (num: number): number => (num % 6) + 1;

const trophyDiceReducer = (state: DiceState, event: diceEvents): DiceState => {
  switch (event.type) {
    case 'roll':
      return {
        lightDice: event.payload.lightResults.map(getD6Result),
        darkDice: event.payload.darkResults.map(getD6Result),
      };
    default:
      return state;
  }
};

export default function DiceArea({
  socket,
}: {
  socket: SocketIOClient.Socket;
}): React.ReactElement {
  const [state, dispatch] = React.useReducer(
    trophyDiceReducer,
    initialDiceState
  );
  const [lightDiceCount, setLightDiceCount] = React.useState('');
  const [darkDiceCount, setDarkDiceCount] = React.useState('');
  const theme: { colors: { text: string } } = useTheme();

  React.useEffect(() => {
    if (socket) {
      socket.on('roll', ({ lightResults, darkResults }) => {
        console.log({ lightResults, darkResults });
        dispatch({ type: 'roll', payload: { lightResults, darkResults } });
      });
    }
  }, [socket]);

  return (
    <Box
      width="100%"
      sx={{ position: ['', '', '', 'sticky'], top: ['', '', '', '24px'] }}
      height="225px"
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplate: '1fr / 1fr 1fr',
          gridGap: 4,
          justifyItems: 'center',
        }}
      >
        <Box>
          <Label as="label" htmlFor="light-dice" variant="text.h2">
            Light Dice
          </Label>
          <Input
            type="number"
            id="light-dice"
            value={lightDiceCount}
            onChange={({ target: { value } }) => setLightDiceCount(value)}
            step="1"
            min="0"
            max="5"
            width={130}
            sx={(styles) => ({
              color: 'text',
              border: 'none',
              textAlign: 'center',
              borderBottom: `1px solid ${styles.colors.text}`,
              '::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            })}
          />
        </Box>
        <Box>
          <Label as="label" htmlFor="dark-dice" variant="text.h2">
            Dark Dice
          </Label>
          <Input
            type="number"
            id="dark-dice"
            value={darkDiceCount}
            onChange={({ target: { value } }) => setDarkDiceCount(value)}
            step="1"
            min="0"
            max="5"
            width={130}
            sx={(styles) => ({
              color: 'text',
              border: 'none',
              textAlign: 'center',
              borderBottom: `1px solid ${styles.colors.text}`,
              '::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
              '::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
                margin: 0,
              },
            })}
          />
        </Box>
        <Box height="75px">
          {state.lightDice.map((num, i) => (
            <LightDie num={num} key={`${num}-${i}`} color={theme.colors.text} />
          ))}
        </Box>
        <Box>
          {state.darkDice.map((num, i) => (
            <DarkDie num={num} key={`${num}-${i}`} color={theme.colors.text} />
          ))}
        </Box>
      </Box>
      <Flex justifyContent="center">
        <Button
          variant="clear"
          mt={3}
          fontSize={4}
          onClick={() => {
            window
              .fetch('/api/random', {
                method: 'POST',
                body: JSON.stringify({
                  size: Number(lightDiceCount) + Number(darkDiceCount),
                }),
              })
              .then((res) => res.json())
              .then(({ nums }) => {
                const lightResults = nums.data.slice(0, Number(lightDiceCount));
                const darkResults = nums.data.slice(0, Number(darkDiceCount));
                socket.emit('roll', { lightResults, darkResults });
              });
          }}
        >
          Roll
        </Button>
      </Flex>
    </Box>
  );
}

const DarkDie = ({ num, color }) => {
  switch (num) {
    case 1:
      return <Icon icon={dice1Outline} color={color} width="4rem" />;
    case 2:
      return <Icon icon={dice2Outline} color={color} width="4rem" />;
    case 3:
      return <Icon icon={dice3Outline} color={color} width="4rem" />;
    case 4:
      return <Icon icon={dice4Outline} color={color} width="4rem" />;
    case 5:
      return <Icon icon={dice5Outline} color={color} width="4rem" />;
    case 6:
      return <Icon icon={dice6Outline} color={color} width="4rem" />;
  }
};

const LightDie = ({ num, color }) => {
  switch (num) {
    case 1:
      return <Icon icon={dice1} color={color} width="4rem" />;
    case 2:
      return <Icon icon={dice2} color={color} width="4rem" />;
    case 3:
      return <Icon icon={dice3} color={color} width="4rem" />;
    case 4:
      return <Icon icon={dice4} color={color} width="4rem" />;
    case 5:
      return <Icon icon={dice5} color={color} width="4rem" />;
    case 6:
      return <Icon icon={dice6} color={color} width="4rem" />;
  }
};
