export enum SquareTypes {
  Player,
  Wall
}

export enum RowTypes {
  Mixed,
  Walls
}

export type Coordinates = {
  // coordinateX
  x: number;
  // coordinateY
  y: number;
};

export type BoardSquare<T> = T extends SquareTypes.Player
  ? { type: T; playerId?: string; isAvailable: boolean }
  : T extends SquareTypes.Wall
    ? { type: T; isPlaced: boolean; isAvailable: boolean; isWalkable: boolean }
    : never;

type BoardRow<T> = { type: RowTypes; squares: BoardSquare<T>[] };

export type Board = Record<number, BoardRow<SquareTypes>>;
