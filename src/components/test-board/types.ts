export enum SquareType {
  Player,
  Wall
}

export enum RowTypes {
  Mixed,
  Walls
}

type BoardSquare<T> = T extends SquareType.Player
  ? { type: T; playerId?: string }
  : T extends SquareType.Wall
    ? { type: T; isPlaced: boolean; isAvailable: boolean; isWalkable: boolean }
    : never;

type BoardRow<T> = { type: RowTypes; squares: BoardSquare<T>[] };

export type Board = Record<number, BoardRow<SquareType>>;

const BOARD_WIDTH = 17;

const createRow = (type: RowTypes, isTopRow: boolean): BoardRow<SquareType> => {
  const array = Array.from(Array(BOARD_WIDTH).keys());
  const row: BoardRow<SquareType> = {
    type,
    squares:
      type === RowTypes.Mixed
        ? array.map((index) => {
            return index % 2 === 0
              ? { type: SquareType.Player }
              : {
                  type: SquareType.Wall,
                  isPlaced: false,
                  isAvailable: !isTopRow,
                  isWalkable: true
                };
          })
        : array.map((index) => {
            const IS_LAST_COLUMN = index < BOARD_WIDTH - 1;
            return {
              type: SquareType.Wall,
              isPlaced: false,
              isAvailable: index % 2 === 0 && IS_LAST_COLUMN,
              isWalkable: index % 2 === 0
            };
          })
  };
  return row;
};

export const createNewBoard = (): Board => {
  const array = Array.from(Array(BOARD_WIDTH).keys());
  const board = array.reduce((map: Board, index) => {
    map[index] = index % 2 === 0 ? createRow(RowTypes.Mixed, index === 0) : createRow(RowTypes.Walls, false);
    return map;
  }, {});
  return board;
};
