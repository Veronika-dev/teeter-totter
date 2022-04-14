export enum BgColor {
  primary, warn, success
}
export enum ElementType {
  square, circle, triangle
}
export enum GameStatus {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  NOT_STARTED = 'NOT_STARTED',
  FAILED = 'FAILED',
  DEMO = 'DEMO',
}

export type TBgColor = keyof typeof BgColor;
export type TElementType = keyof typeof ElementType;
export type TGameStatus = keyof typeof GameStatus;
export type TSide = 'left' | 'right';

export interface IGameElement {
  readonly id: symbol;
  weight: number;
  offset: number;
  side: TSide;
  color: TBgColor;
  type: TElementType;
}

export interface State {
  weights: IGameElement[];
  fallingWeight: IGameElement | null;
  gameStatus: TGameStatus;
  bending: number;
}
