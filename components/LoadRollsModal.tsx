import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { Checkbox, Label } from '@rebass/forms';
import { configuredRoll } from './DiceSelectionForm/DiceSelectionForm';

interface LoadRollsModalProps {
  isOpen: boolean;
  onDismiss: (e: React.SyntheticEvent, rolls?: configuredRoll[]) => void;
}

const LoadRollsModal: React.FC<LoadRollsModalProps> = ({
  isOpen,
  onDismiss,
}) => {
  const [storedRolls, setStoredRolls] = React.useState<configuredRoll[]>([]);
  const [checkedIndex, setCheckedIndex] = React.useState<{
    [key: string]: boolean;
  }>({});
  React.useEffect(() => {
    const localRolls = window.localStorage.getItem('rolls');
    if (localRolls) {
      setStoredRolls(JSON.parse(localRolls));
    }
  }, [setStoredRolls]);
  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} aria-label="Load saved rolls">
      <Heading as="h3">Load saved rolls</Heading>
      <Text fontSize={1}>Select which saved rolls to load</Text>
      <Box as="form" mt={3}>
        {storedRolls.map((roll, i) => (
          <Flex
            as="label"
            htmlFor={`${roll.rollName}-${i}`}
            alignItems="center"
            key={`${roll.rollName}-${i}`}
          >
            <Checkbox
              checked={checkedIndex[i]}
              name={`${roll.rollName}-${i}`}
              id={`${roll.rollName}-${i}`}
              onChange={() =>
                setCheckedIndex((checked) => {
                  return checked[i]
                    ? { ...checked, [i]: false }
                    : { ...checked, [i]: true };
                })
              }
            />
            {roll.rollName}
          </Flex>
        ))}
        <Button
          onClick={(e) => {
            onDismiss(
              e,
              storedRolls.filter((r, i) => checkedIndex[i])
            );
          }}
          mt={4}
        >
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default LoadRollsModal;
