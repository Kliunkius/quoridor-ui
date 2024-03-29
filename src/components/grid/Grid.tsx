import _ from 'lodash';
import { useEffect, useState } from 'react';

import { Board, SquareTypes, Coordinates } from './SquareTypes';
import Hitbox from './Hitbox';
import Wall from './Wall';
import { formatMessage } from '../../hooks/useWebsocketClient';
import { MessageTypes } from '../../hooks/websocketTypes';
import PlayerTile from './Player';
import NextMove from './NextMove';

type PropsGrid = {
  board: Board;
  ws: WebSocket;
  yourTurn: boolean;
  playerID: string;
};
const Grid: React.FC<PropsGrid> = ({ board, ws, yourTurn, playerID }) => {
  const [grid, setGrid] = useState([<mesh></mesh>]);

  const keys = Object.keys(board).map((key) => Number(key));

  useEffect(() => {
    const gridNew = [<mesh></mesh>];
    keys.map((row, indexRow) => {
      board[row].squares.map((square, indexColumn) => {
        const coordinates: Coordinates = { x: indexColumn, y: indexRow };
        if (square.type === SquareTypes.Wall) {
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
        if (square.type === SquareTypes.Player) {
          if (yourTurn && square?.playerId === playerID) {
            gridNew.push(<PlayerTile coordinates={coordinates} />);
          }
          if (yourTurn && square.isAvailable) {
            gridNew.push(
              <NextMove
                coordinates={coordinates}
                handleMovePlayer={() =>
                  ws.send(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Player, coordinates }))
                }
              />
            );
          }
        }
      });
    });
    setGrid(gridNew);
  }, [yourTurn]);

  return <>{grid}</>;
};

export default Grid;
