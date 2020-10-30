import * as React from 'react';
import { Tooltip } from 'react-tippy';
import { Heading, Text } from 'rebass';

interface DisplayedLinesState {
  lines: { label: string; notes: string }[];
}

type classification = 'line' | 'veil' | 'ask' | 'consent';

type displayedLinesEvents =
  | {
      type: 'updateClassification';
      payload: { id: string; classification: classification; notes?: string };
    }
  | {
      type: 'updateNote';
      payload: { id: string; note: string };
    };

const displayedLinesReducer = (
  state: DisplayedLinesState,
  event: displayedLinesEvents
): DisplayedLinesState => {
  switch (event.type) {
    case 'updateClassification':
      if (event.payload.classification === 'line') {
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

const initialState: DisplayedLinesState = {
  lines: [],
};

export default function DisplayedLines({
  socket,
}: {
  socket: SocketIOClient.Socket;
}): React.ReactElement {
  const [state, dispatch] = React.useReducer(
    displayedLinesReducer,
    initialState
  );
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
      <Heading as="h4" variant="text.h4" mb={2}>
        Lines
      </Heading>
      <Text variant="text.p">
        {state.lines
          .map((line, i) => (
            <PrintedItem
              label={line.label}
              notes={line.notes}
              key={line.label}
            />
          ))
          .reduce((acc, cur, i) => [cur, ', ', ...acc], [])}
      </Text>
    </>
  );
}

const PrintedItem = ({
  label,
  notes,
}: {
  label: string;
  notes?: string;
}): React.ReactElement => {
  if (notes) {
    return (
      <Tooltip arrow title={notes} key={label}>
        {label}*
      </Tooltip>
    );
  } else {
    return (
      <div key={label} style={{ display: 'inline-block' }}>
        {label}
      </div>
    );
  }
};
