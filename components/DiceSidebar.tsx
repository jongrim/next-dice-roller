import * as React from 'react';
import { Button, Flex } from 'rebass';
import { Icon } from '@iconify/react';
import { v4 as uuidv4 } from 'uuid';
import uniqueId from 'lodash.uniqueid';
import { Tooltip } from 'react-tippy';
import diceD4Outline from '@iconify/icons-mdi/dice-d4-outline';
import diceD6Outline from '@iconify/icons-mdi/dice-d6-outline';
import diceD8Outline from '@iconify/icons-mdi/dice-d8-outline';
import diceD10Outline from '@iconify/icons-mdi/dice-d10-outline';
import diceD12Outline from '@iconify/icons-mdi/dice-d12-outline';
import diceD20Outline from '@iconify/icons-mdi/dice-d20-outline';
import plusBoxOutline from '@iconify/icons-mdi/plus-box-outline';
import clockIcon from '@iconify/icons-mdi-light/clock';
import coinIcon from '@iconify/icons-system-uicons/coin';
import cameraImage from '@iconify/icons-mdi/camera-image';
import NewClockModal from './NewClockModal';
import { GraphicDie } from '../types/dice';
import { Clock } from '../types/clock';
import NewImgModal from './NewImgModal';
import { Img } from '../types/image';
import CustomDieModal from './CustomDieModal';
import { Input } from '@rebass/forms';
import invert from '../utils/invertColor';
import Token from '../types/token';

export const CLIENT_ID = uuidv4();

let LEFT_OFFSET = 0;
let TOP_OFFSET = 0;
const TOP_INCREASE = 75;

interface DiceSidebarProps {
  addDie: (die: GraphicDie) => void;
  addClock: (clock: Clock) => void;
  addImg: (img: Img) => void;
  addToken: (token: Token) => void;
  removeImg: (id: string) => void;
  setBgImage: (url: string) => void;
  imgs: Img[];
}

const DiceSidebar = ({
  addClock,
  addDie,
  addImg,
  addToken,
  removeImg,
  setBgImage,
  imgs,
}: DiceSidebarProps): React.ReactElement => {
  const [maxHeight, setMaxHeight] = React.useState(0);
  const [addClockModalIsOpen, setAddClockModalIsOpen] = React.useState(false);
  const [addImgModalIsOpen, setAddImgModalIsOpen] = React.useState(false);
  const [addCustomDieModalIsOpen, setAddCustomDieModalIsOpen] = React.useState(
    false
  );
  const [color, setColor] = React.useState('#cccccc');

  const showCustomDieModal = () => setAddCustomDieModalIsOpen(true);

  React.useEffect(() => {
    const getMaxHeight = (ev: UIEvent) => {
      // @ts-ignore
      setMaxHeight(ev.target.innerHeight - 60);
    };
    window.addEventListener('resize', getMaxHeight);
    setMaxHeight(window.innerHeight - 60);
    return () => window.removeEventListener('resize', getMaxHeight);
  }, [setMaxHeight]);

  const makeDie = (sides: number): GraphicDie => {
    const die = {
      sides,
      bgColor: color,
      fontColor: invert(color),
      id: uniqueId(`die-${CLIENT_ID}-`),
      curNumber: (Math.floor(Math.random() * 100) % sides) + 1,
      rollVersion: 1,
      left: LEFT_OFFSET,
      top: TOP_OFFSET,
    };
    TOP_OFFSET = (TOP_OFFSET % maxHeight) + TOP_INCREASE;
    return die;
  };

  const makeToken = (): Token => ({
    id: uniqueId(`token-${CLIENT_ID}-`),
    bgColor: color,
  });

  return (
    <Flex
      className="sidebar"
      width={100}
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
      sx={(style) => ({
        borderRight: `1px ${style.colors.text} solid`,
      })}
    >
      <Input
        aria-label="new die color"
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        p={0}
        sx={{ border: 'none', cursor: 'pointer' }}
        width="2.5rem"
        height="2.5rem"
      />
      <Button
        variant="ghost"
        style={{ border: 'none' }}
        onClick={() => addDie(makeDie(4))}
      >
        <Icon height="2rem" icon={diceD4Outline} />
      </Button>
      <Button
        variant="ghost"
        style={{ border: 'none' }}
        onClick={() => addDie(makeDie(6))}
      >
        <Icon height="2rem" icon={diceD6Outline} />
      </Button>
      <Button
        variant="ghost"
        style={{ border: 'none' }}
        onClick={() => addDie(makeDie(8))}
      >
        <Icon height="2rem" icon={diceD8Outline} />
      </Button>
      <Button
        variant="ghost"
        style={{ border: 'none' }}
        onClick={() => addDie(makeDie(10))}
      >
        <Icon height="2rem" icon={diceD10Outline} />
      </Button>
      <Button
        variant="ghost"
        style={{ border: 'none' }}
        onClick={() => addDie(makeDie(12))}
      >
        <Icon height="2rem" icon={diceD12Outline} />
      </Button>
      <Button
        variant="ghost"
        style={{ border: 'none' }}
        onClick={() => addDie(makeDie(20))}
      >
        <Icon height="2rem" icon={diceD20Outline} />
      </Button>
      <Tooltip arrow title="Add custom die" position="right">
        <Button
          variant="ghost"
          style={{ border: 'none' }}
          onClick={showCustomDieModal}
        >
          <Icon height="2rem" icon={plusBoxOutline} />
        </Button>
      </Tooltip>
      <Tooltip arrow title="Add a clock" position="right">
        <Button
          variant="ghost"
          style={{ border: 'none' }}
          onClick={() => setAddClockModalIsOpen(true)}
        >
          <Icon height="2rem" icon={clockIcon} />
        </Button>
      </Tooltip>
      <Tooltip arrow title="Add token" position="right">
        <Button
          variant="ghost"
          style={{ border: 'none' }}
          onClick={() => addToken(makeToken())}
        >
          <Icon height="2rem" icon={coinIcon} />
        </Button>
      </Tooltip>
      <Tooltip arrow title="Manage images" position="right">
        <Button
          variant="ghost"
          style={{ border: 'none' }}
          onClick={() => setAddImgModalIsOpen(true)}
        >
          <Icon height="2rem" icon={cameraImage} />
        </Button>
      </Tooltip>
      <CustomDieModal
        isOpen={addCustomDieModalIsOpen}
        onDone={(die?: GraphicDie) => {
          if (die) {
            addDie({ ...die, bgColor: color });
          }
          setAddCustomDieModalIsOpen(false);
        }}
      />
      <NewImgModal
        onDone={(urls?: { [x: number]: string }, bgImage = '') => {
          if (urls) {
            Object.keys(urls).forEach((id) => {
              if (urls[id]) {
                addImg({ id, url: urls[id] });
              }
            });
          }
          setBgImage(bgImage);
          setAddImgModalIsOpen(false);
        }}
        imgs={imgs}
        removeImg={removeImg}
        isOpen={addImgModalIsOpen}
      />
      <NewClockModal
        onDone={(clock?: Clock) => {
          if (clock) {
            addClock({ ...clock, left: LEFT_OFFSET, top: TOP_OFFSET });
            TOP_OFFSET = (TOP_OFFSET % maxHeight) + TOP_INCREASE;
          }
          setAddClockModalIsOpen(false);
        }}
        isOpen={addClockModalIsOpen}
      />
    </Flex>
  );
};

export default DiceSidebar;
