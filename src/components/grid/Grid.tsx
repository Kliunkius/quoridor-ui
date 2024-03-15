import _ from 'lodash';
import { useEffect, useState } from 'react';

import { Board, SquareTypes, Coordinates } from './SquareTypes';
import HitboxUnavailable from './HitboxUnavailable';
import Hitbox from './Hitbox';
import Wall from './Wall';

type PropsGrid = {
  board: Board;
  ws: WebSocket;
  yourTurn: boolean;
};
const Grid: React.FC<PropsGrid> = ({ board, ws, yourTurn }) => {
  const [grid, setGrid] = useState([<mesh></mesh>]);

  const keys = Object.keys(board).map((key) => Number(key));

  useEffect(() => {
    const gridNew = [<mesh></mesh>];
    let indexRow = 0;
    keys.map((row) => {
      let indexColumn = 0;
      board[row].squares.map((square) => {
        if (square.type === SquareTypes.Wall) {
          const coordinates: Coordinates = { x: indexColumn, y: indexRow };
          if (square.isAvailable && yourTurn) {
            gridNew.push(<Hitbox coordinates={coordinates} ws={ws} />);
          } else if (!square.isAvailable && square.isWalkable && yourTurn) {
            gridNew.push(<HitboxUnavailable coordinates={coordinates} />);
          } else if (square.isPlaced) {
            gridNew.push(<Wall coordinates={coordinates} color="orange" />);
          }
        }
        indexColumn++;
      });
      indexRow++;
    });
    setGrid(gridNew);
  }, [yourTurn]);

  return <>{grid}</>;
};

export default Grid;
