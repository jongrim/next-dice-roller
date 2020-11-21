import * as React from 'react';
import { Flex, Button, Text } from 'rebass';
import { emitEvent } from '../../utils/goatcounter';
import { diceNeedsSubmission } from '../../types/dice';
import { Tooltip } from 'react-tippy';
import MoreSvg from './MoreSvg';

const ConfiguredRollListItem = ({
  roll,
  rolls,
  onSubmit,
  setEditRollId,
  storedRollIds,
  setStoredRollIds,
  setRolls,
  socket,
}) => {
  const [sideMenuOpen, setSideMenuOpen] = React.useState(false);
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      mb={2}
      key={roll.id}
      data-testid={`configured-roll-${roll.rollName}`}
    >
      <Text color="text" key={roll.rollName}>
        {roll.rollName}
      </Text>
      <Flex alignItems="center">
        <Button
          type="button"
          variant="special"
          onClick={() => {
            emitEvent({
              path: 'roll-saved-roll',
              title: 'roll saved roll',
            });
            const needs: diceNeedsSubmission = roll.dice.reduce((acc, cur) => {
              return {
                ...acc,
                [`d${cur}`]: {
                  needs: acc[`d${cur}`] ? acc[`d${cur}`].needs + 1 : 1,
                  sides: parseInt(cur, 10),
                  name: `d${cur}`,
                },
              };
            }, {});
            onSubmit(needs, {
              name: roll.rollName,
              modifier: roll.modifier,
              addToCurrentRoll: false,
            });
          }}
        >
          Roll
        </Button>
        <Tooltip
          key={`roll-${roll.id}`}
          theme="light"
          position="right"
          trigger="click"
          interactive
          onRequestClose={() => {
            setSideMenuOpen(false);
          }}
          useContext
          open={sideMenuOpen}
          html={
            <Flex flexDirection="column">
              <Button
                mt={2}
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditRollId(roll.id);
                  setSideMenuOpen(false);
                }}
              >
                Edit
              </Button>
              <Button
                mt={2}
                type="button"
                variant="special"
                onClick={() => {
                  socket.emit('share-roll', { roll });
                }}
              >
                Send to room
              </Button>
              <Button
                mt={2}
                type="button"
                variant="danger"
                onClick={() => {
                  emitEvent({
                    path: 'remove-saved-roll',
                    title: 'remove saved roll',
                  });
                  const newRollIds = storedRollIds.filter(
                    (id) => id !== roll.id
                  );
                  setStoredRollIds(newRollIds);
                  window.localStorage.removeItem(roll.id);
                  window.localStorage.setItem(
                    'rollIds',
                    JSON.stringify(newRollIds)
                  );
                  setRolls(rolls.filter((r) => r.id !== roll.id));
                }}
              >
                Delete
              </Button>
            </Flex>
          }
        >
          <Button
            ml={2}
            variant="clear"
            onClick={() => setSideMenuOpen((val) => !val)}
            data-testid="roll-options"
          >
            <MoreSvg />
          </Button>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default ConfiguredRollListItem;
