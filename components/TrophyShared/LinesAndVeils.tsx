import * as React from 'react';
import { Box, Button, Text } from 'rebass';
import { Radio as RebassRadio, Label, Input } from '@rebass/forms';
import { v4 as uuidv4 } from 'uuid';

const itemFactory = (label) => ({ label, id: uuidv4(), notes: '' });

const Radio = (props) => (
  <RebassRadio
    {...props}
    sx={Object.assign(
      {
        'input:disabled ~ &': {
          color: 'text',
        },
        'input:checked ~ &': {
          color: 'text',
        },
      },
      props.sx
    )}
  />
);

type classification = 'line' | 'veil' | 'ask' | 'consent';

interface Item {
  id: string;
  label: string;
  classification?: classification;
  notes?: string;
}

interface LinesAndVeils {
  items: Item[];
}

type linesAndVeilsEvents =
  | {
      type: 'addItem';
      payload: { item: Item };
    }
  | {
      type: 'updateClassification';
      payload: { id: string; classification: classification };
    }
  | {
      type: 'updateNote';
      payload: { id: string; note: string };
    };

const linesAndVeilsReducer = (
  state: LinesAndVeils,
  event: linesAndVeilsEvents
): LinesAndVeils => {
  switch (event.type) {
    case 'addItem':
      return { items: state.items.concat(event.payload.item) };
    case 'updateClassification':
      return {
        items: state.items.map((item) => {
          if (item.id === event.payload.id) {
            return {
              ...item,
              classification: event.payload.classification,
            };
          }
          return item;
        }),
      };
    case 'updateNote':
      return {
        items: state.items.map((item) => {
          if (item.id === event.payload.id) {
            return {
              ...item,
              notes: event.payload.note,
            };
          }
          return item;
        }),
      };
    default:
      return state;
  }
};

const initialLinesAndVeils: LinesAndVeils = {
  items: [
    'Alcoholism',
    'Bullying',
    'Childhood Abandonment',
    'Classism',
    'Drug Abuse',
    'Eye Injuries',
    'Graphic Gore',
    'Harm to Animals',
    'Harm to Children',
    'Racism',
    'Sexual Assault',
    'Human Sexuality',
    'Slavery',
    'Spiders',
    'Starvation',
    'Suicide',
    'Torture',
    'Homophobia',
    'Kissing',
    'Kink',
    'Lonileness',
    'Covid-19 / pandemics',
    "Celebrating others' misery",
    'Bystanders seriously hurt',
  ].map(itemFactory),
};

export default function LinesAndVeils(): React.ReactElement {
  const [state, dispatch] = React.useReducer(
    linesAndVeilsReducer,
    initialLinesAndVeils
  );
  const [newItemLabel, setNewItemLabel] = React.useState('');
  return (
    <Box
      px={4}
      pb={4}
      sx={{
        display: 'grid',
        gridTemplate: '70px 1fr / 200px 100px 100px 100px 100px 1fr',
        justifyItems: 'center',
        alignItems: 'center',
      }}
    >
      <Box />
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Line
      </Text>
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Veil
      </Text>
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Ask First
      </Text>
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Enthusiastic Consent
      </Text>
      <Text
        bg="background"
        width="100%"
        height="100%"
        py={2}
        sx={(styles) => ({
          position: 'sticky',
          top: '0px',
          borderBottom: `1px solid ${styles.colors.secondaryText}`,
          textAlign: 'center',
        })}
        alignSelf="end"
        variant="text.p"
      >
        Notes
      </Text>
      {state.items.map((item) => (
        <React.Fragment key={item.id}>
          <Label htmlFor={item.label} variant="text.label">
            {item.label}
          </Label>
          <Label
            width="25px"
            height="25px"
            sx={{ cursor: 'pointer' }}
            aria-label={`line ${item.label}`}
          >
            <Radio
              checked={item.classification === 'line'}
              id={`${item.label}-line`}
              name={item.label}
              value={`${item.label}-line`}
              onChange={() => {
                dispatch({
                  type: 'updateClassification',
                  payload: { id: item.id, classification: 'line' },
                });
              }}
            />
          </Label>
          <Label
            width="25px"
            height="25px"
            sx={{ cursor: 'pointer' }}
            aria-label={`veil ${item.label}`}
          >
            <Radio
              checked={item.classification === 'veil'}
              id={`${item.label}-veil`}
              name={item.label}
              value={`${item.label}-veil`}
              onChange={() =>
                dispatch({
                  type: 'updateClassification',
                  payload: { id: item.id, classification: 'veil' },
                })
              }
            />
          </Label>
          <Label
            width="25px"
            height="25px"
            sx={{ cursor: 'pointer' }}
            aria-label={`ask ${item.label}`}
          >
            <Radio
              checked={item.classification === 'ask'}
              id={`${item.label}-ask`}
              name={item.label}
              value={`${item.label}-ask`}
              onChange={() =>
                dispatch({
                  type: 'updateClassification',
                  payload: { id: item.id, classification: 'ask' },
                })
              }
            />
          </Label>
          <Label
            width="25px"
            height="25px"
            sx={{ cursor: 'pointer' }}
            aria-label={`consent ${item.label}`}
          >
            <Radio
              checked={item.classification === 'consent'}
              id={`${item.label}-consent`}
              name={item.label}
              value={`${item.label}-consent`}
              onChange={() =>
                dispatch({
                  type: 'updateClassification',
                  payload: { id: item.id, classification: 'consent' },
                })
              }
            />
          </Label>
          <Input
            id={`${item.label}-note`}
            name={`${item.label}-note`}
            value={item.notes}
            variant="text.p"
            sx={(styles) => ({
              border: 'none',
              borderBottom: `1px solid ${styles.colors.text}`,
            })}
            onChange={({ target }) => {
              dispatch({
                type: 'updateNote',
                payload: { id: item.id, note: target.value },
              });
            }}
          />
        </React.Fragment>
      ))}
      <Input
        mt={3}
        width="95%"
        id="new-item-label"
        name="new-item-label"
        sx={(styles) => ({
          gridColumn: '1 / 6',
          border: 'none',
          borderBottom: `1px solid ${styles.colors.text}`,
          justifySelf: 'start',
        })}
        variant="text.p"
        value={newItemLabel}
        onChange={({ target }) => setNewItemLabel(target.value)}
      />
      <Button
        mt={3}
        variant="ghost"
        width="100%"
        sx={{
          gridColumn: '6 / 6',
        }}
        onClick={() => {
          dispatch({
            type: 'addItem',
            payload: { item: itemFactory(newItemLabel) },
          });
          setNewItemLabel('');
        }}
      >
        Add New
      </Button>
    </Box>
  );
}
