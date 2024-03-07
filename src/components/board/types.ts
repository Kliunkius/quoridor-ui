export enum SquareTypes {
  Player,
  Wall
}

export enum RowTypes {
  Mixed,
  Walls
}

type BoardSquare<T> = T extends SquareTypes.Player
  ? { type: T; playerId?: string }
  : T extends SquareTypes.Wall
    ? { type: T; isPlaced: boolean }
    : never;

type BoardRow<T> = { type: RowTypes; row: BoardSquare<T>[] };

export type Board = Record<number, BoardRow<SquareTypes>>;

const BOARD_WIDTH = 17;

const createRow = (type: RowTypes): BoardRow<SquareTypes> => {
  const array = Array.from(Array(BOARD_WIDTH).keys());
  const row: BoardRow<SquareTypes> = {
    type,
    row:
      type === RowTypes.Mixed
        ? array.map((index) => {
            return index % 2 ? { type: SquareTypes.Player } : { type: SquareTypes.Wall, isPlaced: false };
          })
        : array.map(() => ({ type: SquareTypes.Wall, isPlaced: false }))
  };
  return row;
};

export const createNewBoard = (): Board => {
  const array = Array.from(Array(BOARD_WIDTH).keys());
  const board = array.reduce((map: Board, index) => {
    map[index] = index % 2 ? createRow(RowTypes.Mixed) : createRow(RowTypes.Walls);
    return map;
  }, {});
  return board;
};
