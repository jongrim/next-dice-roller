import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { useTheme } from 'emotion-theming';
import { v4 as uuidv4 } from 'uuid';
import Icon from '@iconify/react';
import deleteIcon from '@iconify/icons-mdi-light/delete';
import { Img } from '../types/image';

interface NewImgModalProps {
  isOpen: boolean;
  onDone: (urls?: { [x: number]: string }) => void;
  removeImg: (id: string) => void;
  imgs: Img[];
}

function NewImgModal({
  isOpen,
  onDone,
  imgs,
  removeImg,
}: NewImgModalProps): React.ReactElement {
  const theme = useTheme();
  const [urls, setUrls] = React.useState({ [uuidv4()]: '' });
  const [board, setBoard] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const finish = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onDone(urls);
    setUrls({ [uuidv4()]: '' });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={finish}
      aria-label="New clock"
      // @ts-ignore
      style={{ backgroundColor: theme.colors.background }}
    >
      <Box py={2} bg="background">
        <Heading as="h2" fontSize={[3, 4, 5]} color="text">
          New Image
        </Heading>
        <Text fontSize={2} color="text">
          Add full URLs for images. Come back to here to manage images later.
        </Text>
      </Box>
      <Box as="form" mt={2}>
        {Object.keys(urls).map((id) => (
          <Box key={id} mt={3}>
            <Label htmlFor={id} color="text">
              Image URL
            </Label>
            <Input
              color="text"
              name={id}
              id="name"
              value={urls[id]}
              onChange={(e) => setUrls({ ...urls, [id]: e.target.value })}
              mt={2}
              required
            />
          </Box>
        ))}
        <Button
          type="button"
          onClick={() => setUrls((cur) => ({ ...cur, [uuidv4()]: '' }))}
          mt={2}
        >
          Add another
        </Button>
        <hr />
        <Heading as="h3" color="text">
          Load a Pinterest Board
        </Heading>
        <Text fontSize={2} color="text">
          Load the images from a public board. The board must be public and you
          need to enter the RSS link (add <code>.rss</code> to the end)
        </Text>
        <Input
          name="board"
          id="board"
          placeholder="https://www.pinterest.com/username/board.rss"
          value={board}
          onChange={(e) => setBoard(e.target.value)}
        />
        <Button
          disabled={loading}
          type="button"
          mt={2}
          onClick={() => {
            setLoading(true);
            window
              .fetch('/api/fetchPinterestBoardImages', {
                method: 'POST',
                body: JSON.stringify({
                  board,
                }),
              })
              .then((res) => res.json())
              .then(({ xml }) => {
                const doc = new DOMParser().parseFromString(xml, 'text/xml');
                const descriptions = Array.from(
                  doc.querySelectorAll('description')
                );
                const imageLinks = descriptions
                  .map((d) => d.innerHTML)
                  .filter(Boolean)
                  .map((t) => {
                    const r = new RegExp(/src="(.+)"/gm);
                    return r.exec(t)[1];
                  })
                  .map((l) => l.replace('236x', '640x'));
                const mapping = imageLinks.reduce(
                  (acc, cur) => ({
                    ...acc,
                    [uuidv4()]: cur,
                  }),
                  {}
                );
                onDone(mapping);
              });
          }}
        >
          {loading ? 'Loading' : 'Load'}
        </Button>
        <hr />
        <Text as="h3" color="text">
          Already Loaded
        </Text>
        {imgs.map(({ id, url }) => (
          <Flex
            key={id}
            mt={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text color="text">{url}</Text>
            <Button
              type="button"
              flex="0 0 3rem"
              onClick={() => removeImg(id)}
              ml={3}
              variant="danger"
            >
              <Icon icon={deleteIcon} />
            </Button>
          </Flex>
        ))}
        <Button mt={3} width="100%" type="submit" onClick={finish}>
          Done
        </Button>
      </Box>
    </Dialog>
  );
}

export default NewImgModal;
