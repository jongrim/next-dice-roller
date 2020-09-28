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

const NewImgModal: React.FC<NewImgModalProps> = ({
  isOpen,
  onDone,
  imgs,
  removeImg,
}) => {
  const theme = useTheme();
  const [urls, setUrls] = React.useState({ [uuidv4()]: '' });

  const finish = (e) => {
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
          mt={3}
        >
          Add another
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
            <Text color="text" sx={{ overflow: 'scroll' }}>
              {url}
            </Text>
            <Button
              type="button"
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
};

export default NewImgModal;
