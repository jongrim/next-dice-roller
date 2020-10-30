import * as React from 'react';
import { Box, Image, Flex, Text, Button } from 'rebass';
import { Label, Input, Textarea } from '@rebass/forms';
import { Icon } from '@iconify/react';
import cameraPlusOutline from '@iconify/icons-mdi/camera-plus-outline';
import { useTheme } from 'emotion-theming';

export default function StaticCharacterCard({
  playerName,
  imageSrc,
  name,
  pronouns,
  background,
  occupation,
  ritual1,
  ritual2,
  ritual3,
  drive,
  baseRuin,
  ruin,
}: {
  playerName: string;
  imageSrc?: string;
  name: string;
  pronouns: string;
  occupation: string;
  background: string;
  ritual1?: string;
  ritual2?: string;
  ritual3?: string;
  drive: string;
  baseRuin: number;
  ruin: number;
}): React.ReactElement {
  const theme: { colors: { text: string } } = useTheme();
  return (
    <Box mb={8}>
      <Box
        sx={{
          display: 'grid',
          gridGap: 4,
          gridTemplateColumns: ['1fr', '150px 1fr', '150px 1fr', '150px 1fr'],
          alignItems: 'end',
        }}
        mb={6}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="treasure-hunter"
            variant="avatar"
            width="100%"
          />
        ) : (
          <Flex
            height="150px"
            justifyContent="center"
            alignItems="center"
            sx={(styles) => ({
              border: `4px dashed ${styles.colors.secondaryText}`,
            })}
          >
            <Icon
              icon={cameraPlusOutline}
              height="2.5rem"
              color={theme.colors.text}
            />
          </Flex>
        )}
        <Flex flexDirection="column" alignItems="flex-end">
          <Text variant="text.p">Played by {playerName}</Text>
          <Input
            disabled
            variant="text.name"
            mb={1}
            value={name}
            placeholder="Character name"
          />
          <Input
            disabled
            variant="text.pronouns"
            mb={3}
            value={pronouns}
            placeholder="Character pronouns"
          />
          <Box
            sx={{
              display: 'grid',
              gridGap: 2,
              gridTemplateColumns: 'repeat(6, 36px)',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Button
                disabled
                variant="ghost"
                key={`ruin-${num}`}
                data-value={num}
                color={num <= baseRuin ? 'muted' : 'text'}
                sx={(styles) => ({
                  position: 'relative',
                  borderColor:
                    num <= baseRuin ? styles.colors.muted : styles.colors.text,
                })}
              >
                {ruin >= num && (
                  <RuinDiagonalMarker permanent={num <= baseRuin} />
                )}
                {num}
              </Button>
            ))}
          </Box>
        </Flex>
      </Box>
      <Box mb={6}>
        <Label as="label" htmlFor="occupation" variant="text.label">
          Occupation
        </Label>
        <Textarea
          rows={1}
          disabled
          variant="text.p"
          id="occupation"
          value={occupation}
          px={0}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
            resize: 'vertical',
          })}
        />
      </Box>
      <Box mb={6}>
        <Label as="label" htmlFor="background" variant="text.label">
          Background
        </Label>
        <Textarea
          rows={1}
          disabled
          variant="text.p"
          id="background"
          value={background}
          px={0}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
            resize: 'vertical',
          })}
        />
      </Box>
      <Box mb={6}>
        <Text variant="text.label">Rituals</Text>
        <Textarea
          rows={1}
          disabled
          variant="text.p"
          id="ritual-1"
          value={ritual1}
          px={0}
          mb={1}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
            resize: 'vertical',
          })}
        />
        <Textarea
          rows={1}
          disabled
          variant="text.p"
          id="ritual-2"
          value={ritual2}
          px={0}
          mb={1}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
            resize: 'vertical',
          })}
        />
        <Textarea
          rows={1}
          disabled
          variant="text.p"
          id="ritual-3"
          value={ritual3}
          px={0}
          mb={1}
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
            resize: 'vertical',
          })}
        />
      </Box>
      <Box>
        <Label as="label" variant="text.label">
          Drive
        </Label>
        <Textarea
          disabled
          id="drive"
          value={drive}
          px={0}
          mb={1}
          variant="text.p"
          sx={(styles) => ({
            color: 'text',
            border: 'none',
            borderBottom: `1px solid ${styles.colors.text}`,
            resize: 'vertical',
          })}
        />
      </Box>
    </Box>
  );
}

const RuinDiagonalMarker = ({ permanent }: { permanent: boolean }) => {
  return (
    <Box
      height="49.5px"
      width="1px"
      sx={(styles) => ({
        borderRight: `1px solid ${
          permanent ? styles.colors.muted : styles.colors.text
        }`,
        position: 'absolute',
        transform: 'translate(4.5px, -15.5px) rotate(0.125turn)',
      })}
    />
  );
};
