export interface DiceBlock {
  dice: number[];
  needs: number;
}

export interface DiceInterface {
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
  rollerIcon: string;
  name?: string;
  modifier?: string;
}
