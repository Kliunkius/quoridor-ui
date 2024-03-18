import _ from 'lodash';
import { useEffect, useState } from 'react';

import { Board, SquareTypes, Coordinates } from './SquareTypes';
import Hitbox from './Hitbox';
import Wall from './Wall';
import { formatMessage } from '../../hooks/useWebsocketClient';
import { MessageTypes } from '../../hooks/websocketTypes';

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
    keys.map((row, indexRow) => {
      board[row].squares.map((square, indexColumn) => {
        if (square.type === SquareTypes.Wall) {
          const coordinates: Coordinates = { x: indexColumn, y: indexRow };
          if (yourTurn && square.isWalkable) {
            gridNew.push(
              <Hitbox
                coordinates={coordinates}
                isAvailable={square.isAvailable}
                handlePlaceWall={() =>
                  ws.send(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Wall, coordinates }))
                }
              />
            );
          } else if (square.isPlaced) {
            gridNew.push(<Wall coordinates={coordinates} color="orange" />);
          }
        }
      });
    });
    setGrid(gridNew);
  }, [yourTurn]);

  return <>{grid}</>;
};

export default Grid;
