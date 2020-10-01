import * as React from 'react';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import gsap, { Elastic } from 'gsap';
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
import cameraImage from '@iconify/icons-mdi/camera-image';
import NewClockModal from './NewClockModal';
import { GraphicDie } from '../types/dice';
import { Clock } from '../types/clock';
import NewImgModal from './NewImgModal';
import { Img } from '../types/image';
import CustomDieModal from './CustomDieModal';
import { Input, Label } from '@rebass/forms';
import invert from '../utils/invertColor';

export const CLIENT_ID = uuidv4();

interface SidebarMachineSchema {
  states: {
    closed: Record<string, unknown>;
    closing: Record<string, unknown>;
    open: Record<string, unknown>;
    opening: Record<string, unknown>;
  };
}

type SidebarEvent = { type: 'OPEN' } | { type: 'CLOSE' };

const SidebarMachine = Machine<SidebarMachineSchema, SidebarEvent>({
  id: 'sidebar',
  initial: 'open',
  states: {
    closed: {
      on: {
        OPEN: { target: 'opening' },
      },
    },
    closing: {
      on: {
        OPEN: { target: 'opening' },
      },
      invoke: {
        src: 'closeMenu',
        onDone: {
          target: 'closed',
        },
      },
      entry: ['setToggleIconOff'],
    },
    opening: {
      on: {
        CLOSE: { target: 'closing' },
      },
      invoke: {
        src: 'openMenu',
        onDone: {
          target: 'open',
        },
      },
      entry: ['setToggleIconOn'],
    },
    open: {
      on: {
        CLOSE: { target: 'closing' },
      },
    },
  },
});

const nextMessageMap: { [key: string]: SidebarEvent } = {
  closed: { type: 'OPEN' },
  closing: { type: 'OPEN' },
  open: { type: 'CLOSE' },
  opening: { type: 'CLOSE' },
};

interface DiceSidebarProps {
  addDie: (die: GraphicDie) => void;
  addClock: (clock: Clock) => void;
  addImg: (img: Img) => void;
  removeImg: (id: string) => void;
  imgs: Img[];
}

const DiceSidebar = ({
  addClock,
  addDie,
  addImg,
  removeImg,
  imgs,
}: DiceSidebarProps): React.ReactElement => {
  const element = React.useRef(null);
  const openMenu = React.useCallback(() => {
    return new Promise((resolve) => {
      gsap.to(element.current || {}, 0.5, {
        left: 0,
        backdropFilter: 'blur(5px)',
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);
  const closeMenu = React.useCallback(() => {
    return new Promise((resolve) => {
      gsap.to(element.current || {}, 0.5, {
        left: -200,
        backdropFilter: 'blur(0px)',
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);

  const [current, send] = useMachine(SidebarMachine, {
    services: {
      openMenu,
      closeMenu,
    },
  });

  const nextMessage: SidebarEvent = nextMessageMap[current.value.toString()];

  const [addClockModalIsOpen, setAddClockModalIsOpen] = React.useState(false);
  const [addImgModalIsOpen, setAddImgModalIsOpen] = React.useState(false);
  const [addCustomDieModalIsOpen, setAddCustomDieModalIsOpen] = React.useState(
    false
  );
  const [color, setColor] = React.useState('#cccccc');

  const showCustomDieModal = () => setAddCustomDieModalIsOpen(true);

  const makeDie = (sides: number): GraphicDie => ({
    sides,
    bgColor: color,
    fontColor: invert(color),
    id: uniqueId(`die-${CLIENT_ID}-`),
    curNumber: sides,
    rollVersion: 1,
  });

  return (
    <Flex
      className="sidebar"
      ref={element}
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
      <Button
        variant="ghost"
        style={{ border: 'none' }}
        onClick={showCustomDieModal}
      >
        <Icon height="2rem" icon={plusBoxOutline} />
      </Button>
      <Tooltip arrow title="Add a clock" position="right">
        <Button
          variant="ghost"
          style={{ border: 'none' }}
          onClick={() => setAddClockModalIsOpen(true)}
        >
          <Icon height="2rem" icon={clockIcon} />
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
        onDone={(urls?: { [x: number]: string }) => {
          if (urls) {
            Object.keys(urls).forEach((id) => {
              if (urls[id]) {
                addImg({ id, url: urls[id] });
              }
            });
          }
          setAddImgModalIsOpen(false);
        }}
        imgs={imgs}
        removeImg={removeImg}
        isOpen={addImgModalIsOpen}
      />
      <NewClockModal
        onDone={(clock?: Clock) => {
          if (clock) {
            addClock(clock);
          }
          setAddClockModalIsOpen(false);
        }}
        isOpen={addClockModalIsOpen}
      />
    </Flex>
  );
};

export default DiceSidebar;
