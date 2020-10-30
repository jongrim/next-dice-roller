import * as React from 'react';
import { Tooltip } from 'react-tippy';
import { Heading, Text } from 'rebass';

interface DisplayedClassificationState {
  lines: { label: string; notes: string }[];
}

type classification = 'line' | 'veil' | 'ask' | 'consent';

type displayedClassificationEvents =
  | {
      type: 'updateClassification';
      payload: { id: string; classification: classification; notes: string };
    }
  | {
      type: 'updateNote';
      payload: { id: string; note: string };
    };

const displayedAskReducer = (
  state: DisplayedClassificationState,
  event: displayedClassificationEvents
) => {
  switch (event.type) {
    case 'updateClassification':
      if (event.payload.classification === 'ask') {
        return {
          lines: state.lines.concat({
            label: event.payload.id,
            notes: event.payload.notes,
          }),
        };
      } else {
        // check that we need to remove a line
        return {
          lines: state.lines.filter((line) => line.label !== event.payload.id),
        };
      }
    case 'updateNote':
      if (state.lines.find(({ label }) => label === event.payload.id)) {
        return {
          lines: state.lines.map((line) => {
            if (line.label === event.payload.id) {
              return {
                label: line.label,
                notes: event.payload.note,
              };
            }
            return line;
          }),
        };
      }
      return state;
    default:
      return state;
  }
};

const initialState: DisplayedClassificationState = {
  lines: [],
};

export default function DisplayedAsk({
  socket,
}: {
  socket: SocketIOClient.Socket;
}): React.ReactElement {
  const [state, dispatch] = React.useReducer(displayedAskReducer, initialState);
  React.useEffect(() => {
    if (socket) {
      socket.on('updateClassification', (event) => {
        dispatch(event);
      });
      socket.on('updateNote', (event) => {
        dispatch(event);
      });
    }
  }, [socket]);
  return (
    <>
      <Heading as="h4" variant="text.h4" mt={3} mb={2}>
        Ask First
      </Heading>
      <Text variant="text.p">
        {state.lines.map((line, i) => {
          if (!line.label) return null;
          if (line.notes) {
            return (
              <Tooltip arrow title={line.notes} key={line.label}>
                {line.label}*{i + 1 < state.lines.length ? ', ' : ' '}
              </Tooltip>
            );
          } else {
            return (
              <div key={line.label} style={{ display: 'inline-block' }}>
                {line.label}
                {i + 1 < state.lines.length ? ', ' : ' '}
              </div>
            );
          }
        })}
      </Text>
    </>
  );
}
