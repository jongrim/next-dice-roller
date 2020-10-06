export interface Clock {
  id: string;
  curSegment: number;
  segments: number;
  name: string;
}

export interface PositionedClock extends Clock {
  top: number;
  left: number;
}
