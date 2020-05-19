import * as React from 'react';
import { Dialog } from '@reach/dialog';
import { Box, Button, Flex, Heading, Image, Text } from 'rebass';
import { Label, Input } from '@rebass/forms';

import useLocalStorage from '../hooks/useLocalStorage';

const icons = [
  'Adventure_Map.svg',
  'Crystal_Shard.svg',
  'Food.svg',
  'Knight.svg',
  'Potion.svg',
  'Treant.svg',
  'Armor.svg',
  'Destructive_Magic.svg',
  'Grim_Reaper.svg',
  'Medusa.svg',
  'Sorceress.svg',
  'Unicorn.svg',
  'Bow_Arrow.svg',
  'Dragon_Egg.svg',
  'Helmet.svg',
  'Monster.svg',
  'Spell_Book.svg',
  'Viking.svg',
  'Castle.svg',
  'Elf.svg',
  'Item_Bag.svg',
  'Orc.svg',
  'Spell_Scroll.svg',
  'Villager.svg',
  'Centaur.svg',
  'Fairy.svg',
  'King.svg',
  'Poison_Spider.svg',
  'Sword.svg',
  'Werewolf.svg',
];

interface UserContextInterface {
  storedUsername: string;
  userIcon: string;
  setStoredUsername: (arg0: string) => void;
  setUserIcon: (arg0: string) => void;
}

export const UserContext = React.createContext<UserContextInterface>({
  storedUsername: '',
  userIcon: '',
  setStoredUsername: () => {},
  setUserIcon: () => {},
});

export const UserProvider = ({ children }) => {
  const [userIcon, setUserIcon] = useLocalStorage('icon', '');
  const [storedUsername, setStoredUsername] = useLocalStorage('username', '');

  return (
    <UserContext.Provider
      value={{
        storedUsername,
        setStoredUsername,
        userIcon,
        setUserIcon,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const UserSetupModal = () => {
  const {
    storedUsername,
    setStoredUsername,
    userIcon,
    setUserIcon,
  } = React.useContext(UserContext);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!storedUsername) {
      setIsOpen(true);
    }
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={() => setIsOpen(false)}
      aria-label="Form to setup username and select icon"
    >
      <Box py={2}>
        <Heading as="h2" fontSize={[3, 4, 5]}>
          Set your username and icon
        </Heading>
        <Text fontSize={2}>
          This can be changed anytime from your profile page
        </Text>
      </Box>
      <Box mt={2}>
        <Label htmlFor="username">Username</Label>
        <Input
          name="username"
          id="username"
          value={storedUsername}
          onChange={(e) => setStoredUsername(e.target.value)}
          mt={2}
        />
      </Box>
      <Box mt={2}>
        <Label htmlFor="icon">User Icon</Label>
        <Input type="hidden" name="icon" value={userIcon} />
        <Flex
          flexWrap="wrap"
          justifyContent="center"
          height="350px"
          mt={2}
          sx={{ overflow: 'scroll', border: '1px #f6f6f6 solid' }}
        >
          {icons.map((i) => (
            <Flex
              width={1 / 5}
              key={i}
              flexDirection="column"
              alignItems="center"
            >
              <Image
                src={`/SVG/${i}`}
                alt={`icon - ${i}`}
                height="80px"
                p={2}
                onClick={(e) => setUserIcon(i)}
                sx={{
                  backgroundColor: userIcon === i ? '#eee' : 'background',
                  cursor: 'pointer',
                }}
              />
            </Flex>
          ))}
        </Flex>
      </Box>
      <Button
        mt={2}
        width="100%"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        Done
      </Button>
    </Dialog>
  );
};

export default UserSetupModal;
