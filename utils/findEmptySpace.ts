export default function findEmptySpace({
  diceboxRect,
  MIN_HEIGHT,
  MIN_WIDTH,
  childrenBoxes,
}: {
  diceboxRect: DOMRect;
  MIN_HEIGHT: number;
  MIN_WIDTH: number;
  childrenBoxes: DOMRect[];
}): { top: number; left: number } {
  if (childrenBoxes.length === 0) {
    return { top: 0, left: diceboxRect.left };
  }

  let spotFound = false;
  let top = diceboxRect.top;
  let bottom = top + MIN_HEIGHT;
  let left = diceboxRect.left;
  let right = left + MIN_WIDTH;
  while (!spotFound) {
    spotFound = true;
    for (const box of childrenBoxes) {
      if (doOverlap({ box1: box, box2: { top, left, bottom, right } })) {
        if (bottom + MIN_HEIGHT < diceboxRect.bottom) {
          // more room below
          top += MIN_HEIGHT / 4;
          bottom += MIN_HEIGHT / 4;
        } else {
          // reset to top and move right
          top = diceboxRect.top;
          bottom = top + MIN_HEIGHT;
          left += MIN_WIDTH / 4;
          right += MIN_WIDTH / 4;
        }
        spotFound = false;
        break;
      }
    }
  }
  return { top: top - diceboxRect.top, left };
}

interface Box {
  top: number;
  left: number;
  bottom: number;
  right: number;
}
const doOverlap = ({ box1, box2 }: { box1: Box; box2: Box }): boolean => {
  if (box1.left >= box2.right || box2.left >= box1.right) return false;
  if (box1.top >= box2.bottom || box2.top >= box1.bottom) return false;
  return true;
};
