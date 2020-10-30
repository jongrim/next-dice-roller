import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Heading } from 'rebass';
import { Label, Input } from '@rebass/forms';
import { useTheme } from 'emotion-theming';

interface NewImgModalProps {
  isOpen: boolean;
  onDone: (url?: string) => void;
}

function NewImgModal({ isOpen, onDone }: NewImgModalProps): React.ReactElement {
  const theme = useTheme();
  const [imgSrc, setImgSrc] = React.useState('');

  const finish = () => {
    onDone(imgSrc);
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
        <Heading as="h2" color="text" variant="text.h2">
          Character Image
        </Heading>
        <Label
          my={3}
          htmlFor="character-image"
          color="text"
          variant="text.label"
        >
          Image URL
        </Label>
        <Input
          variant="text.p"
          name="character-image"
          id="character-image"
          value={imgSrc}
          onChange={(e) => setImgSrc(e.target.value)}
          mt={2}
        />
      </Box>
      <Button my={3} variant="ghost" onClick={finish}>
        Done
      </Button>
    </Dialog>
  );
}

export default NewImgModal;
