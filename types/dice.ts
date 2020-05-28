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
  d2: DiceBlock;
  d4: DiceBlock;
  d6: DiceBlock;
  d8: DiceBlock;
  d10: DiceBlock;
  d12: DiceBlock;
  d20: DiceBlock;
  d100: DiceBlock;
}

export interface DiceState {
  state: string;
  dice: DiceInterface;
  roller: string;
  name?: string;
  modifier?: string;
  id: string;
}
