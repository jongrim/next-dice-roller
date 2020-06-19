import * as React from 'react';
import { Button, Image, Text } from 'rebass';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';
import { TweenMax, Elastic } from 'gsap';

import { emitEvent } from '../../utils/goatcounter';
import { configuredRoll } from './DiceSelectionForm';
import CheckSvg from './CheckSvg';

interface SaveRollsAnimationMachine {
  states: {
    static: {};
    animatingIn: {};
    waiting: {};
    animatingOut: {};
  };
}

type SaveRollsAnimationEvents = { type: 'ANIMATE' };

const SaveRollsAnimationMachine = Machine<
  SaveRollsAnimationMachine,
  SaveRollsAnimationEvents
>({
  id: 'saveRollsAnimation',
  initial: 'static',
  states: {
    static: {
      on: {
        ANIMATE: 'animatingIn',
      },
    },
    animatingIn: {
      invoke: {
        src: 'showSaveIcon',
        onDone: {
          target: 'waiting',
        },
      },
    },
    animatingOut: {
      invoke: {
        src: 'hideSaveIcon',
        onDone: {
          target: 'static',
        },
      },
    },
    waiting: {
      after: {
        3000: 'animatingOut',
      },
    },
  },
});

interface SaveRollButtonInterface {
  alreadySaved: boolean;
  roll: configuredRoll;
  saveRoll: (roll: configuredRoll) => void;
}

const SaveRollButton: React.FC<SaveRollButtonInterface> = ({
  alreadySaved,
  roll,
  saveRoll,
}) => {
  const saveText = React.useRef(null);
  const saveIcon = React.useRef(null);
  const showSaveIcon = React.useCallback(() => {
    return new Promise((resolve) => {
      const hideSaveText = () =>
        TweenMax.to(saveText.current, 1, {
          visibility: 'hidden',
        });
      TweenMax.to(saveText.current, 0.5, {
        visibility: 'hidden',
        scale: 0.6,
        ease: Elastic.easeOut.config(1, 1),
        onComplete: hideSaveText,
      });
      TweenMax.to(saveIcon.current, 0.5, {
        visibility: 'visible',
        scale: 1,
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      }).delay(0.3);
    });
  }, []);
  const hideSaveIcon = React.useCallback(() => {
    return new Promise((resolve) => {
      TweenMax.to(saveText.current, 1, {
        visibility: 'visible',
        scale: 1,
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
      TweenMax.to(saveIcon.current, 0.5, {
        visibility: 'hidden',
        scale: 0.6,
        ease: Elastic.easeOut.config(1, 1),
        onComplete: resolve,
      });
    });
  }, []);
  const [current, dispatch] = useMachine(SaveRollsAnimationMachine, {
    services: {
      showSaveIcon,
      hideSaveIcon,
    },
  });
  return (
    <Button
      disabled={alreadySaved}
      variant="ghost"
      ml={2}
      width="62px"
      type="button"
      onClick={() => {
        emitEvent({
          path: 'save-rolls',
          title: 'save rolls',
        });
        dispatch('ANIMATE');
        saveRoll(roll);
      }}
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text color="text" ref={saveText} sx={{ position: 'absolute' }}>
        {alreadySaved ? 'Saved' : 'Save'}
      </Text>
      <CheckSvg ref={saveIcon} />
    </Button>
  );
};

export default SaveRollButton;
