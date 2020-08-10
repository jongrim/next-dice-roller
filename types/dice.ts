export interface Die {
  name: string;
  sides: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface DiceBlock {
  results: number[];
  needs: number;
  sides: number;
}

export interface DieNeed {
  needs: number;
  sides: number;
  name: string;
}

export type diceNeedsSubmission = {
  [key: string]: DieNeed;
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
  rolls: Roll[];
  addToCurrentRoll?: boolean;
}

export interface Roll {
  dice: DiceInterface;
  roller: string;
  name?: string;
  modifier?: string;
  id: string;
}
