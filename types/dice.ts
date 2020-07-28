export interface Die {
  name: string;
  sides: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface DiceBlock {
  dice: number[];
  needs: number;
}

export type diceNeedsSubmission = {
  d2?: number;
  d4?: number;
  d6?: number;
  d8?: number;
  d10?: number;
  d12?: number;
  d20?: number;
  d100?: number;
};

export interface DiceInterface {
  [key: string]: DiceBlock;
}

export interface DiceState {
  state: string;
  dice: DiceInterface;
  roller: string;
  name?: string;
  modifier?: string;
  id: string;
}
