import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { Checkbox } from '@rebass/forms';
import { configuredRoll } from './DiceSelectionForm/DiceSelectionForm';

interface LoadRollsModalProps {
  isOpen: boolean;
  loadedRolls: configuredRoll[];
  onDismiss: (e: React.SyntheticEvent, rolls?: configuredRoll[]) => void;
  storedRollIds: configuredRoll['id'][];
}

const LoadRollsModal: React.FC<LoadRollsModalProps> = ({
  isOpen,
  loadedRolls,
  onDismiss,
  storedRollIds,
}) => {
  const [rollsToLoad, setRollsToLoad] = React.useState<configuredRoll[]>([]);
  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} aria-label="Load saved rolls">
      <Heading as="h3">Load saved rolls</Heading>
      <Text fontSize={1}>
        Select which saved rolls to load into the current room
      </Text>
      <Box as="form" data-testid="load-rolls-form" mt={3}>
        {storedRollIds.map((id) => {
          const roll: configuredRoll = JSON.parse(
            window.localStorage.getItem(id)
          );
          const alreadyLoaded = loadedRolls.some((r) => r.id === id);
          return (
            <Flex
              as="label"
              htmlFor={roll.id}
              alignItems="center"
              key={roll.id}
            >
              <Checkbox
                checked={rollsToLoad.some((r) => r.id === id) || alreadyLoaded}
                disabled={alreadyLoaded}
                name={roll.id}
                id={roll.id}
                onChange={() =>
                  setRollsToLoad((rolls) => {
                    return rolls.some((r) => r.id === id)
                      ? rolls.filter((r) => r.id !== id)
                      : [...rolls, roll];
                  })
                }
                sx={{
                  'input:disabled ~ &': {
                    color: 'secondary',
                  },
                }}
              />
              {roll.rollName}
            </Flex>
          );
        })}
        <Button
          onClick={(e) => {
            onDismiss(e, rollsToLoad);
          }}
          mt={3}
        >
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default LoadRollsModal;
