import _ from 'lodash';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { Board, SquareTypes, Coordinates } from './SquareTypes';
import Hitbox from './Hitbox';
import Wall from './Wall';
import { formatMessage } from '../../hooks/useWebsocketClient';
import { MessageTypes } from '../../hooks/websocketTypes';
import PlayerTile from './PlayerTile';
import NextMoveTile from './NextMoveTile';
import GargoylePlayer from '../board/GargoylePlayer';
import GargoyleEnemy from '../board/GargoyleEnemy';

type PropsGrid = {
  board: Board;
  ws: WebSocket;
  yourTurn: boolean;
  playerID: string;
  isPlayerHost: boolean;
};

type GridMap = Record<string, ReactNode[]>;

const stringifyCoordinates = (coordinates: Coordinates): string => `${coordinates.x}-${coordinates.y}`;

const Grid: React.FC<PropsGrid> = ({ board, ws, yourTurn, playerID, isPlayerHost }) => {
  const [grid, setGrid] = useState<GridMap>({});
  const [isPressed, setIsPressed] = useState(false);
  const firstRender = useRef(true);

  const keys = Object.keys(board).map((key) => Number(key));

  useEffect(() => {
    setIsPressed(false);
  }, [yourTurn]);

  useEffect(() => {
    const gridNew: GridMap = {};
    keys.map((row, indexRow) => {
      board[row].squares.map((square, indexColumn) => {
        const coordinates: Coordinates = { x: indexColumn, y: indexRow };
        const key = stringifyCoordinates(coordinates);
        if (square.type === SquareTypes.Wall) {
          if (yourTurn && square.isWalkable) {
            const elementHitbox = (
              <Hitbox
                coordinates={coordinates}
                isAvailable={square.isAvailable}
                handlePlaceWall={() =>
                  ws.send(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Wall, coordinates }))
                }
              />
            );
            gridNew[key] = [...(gridNew[key] || []), elementHitbox];
          } else if (square.isPlaced) {
            const elementWall = <Wall coordinates={coordinates} color="orange" />;
            gridNew[key] = [...(gridNew[key] || []), elementWall];
          }
        } else if (square.type === SquareTypes.Player) {
          if (square?.playerId === playerID) {
            if (yourTurn) {
              const elementPlayerTile = (
                <PlayerTile
                  coordinates={coordinates}
                  handleOnClick={() => setIsPressed((prevIsPressed) => !prevIsPressed)}
                />
              );
              gridNew[key] = [...(gridNew[key] || []), elementPlayerTile];
            }
            const elementGargoylePlayer = <GargoylePlayer isRotated={!isPlayerHost} coordinates={coordinates} />;
            gridNew[key] = [...(gridNew[key] || []), elementGargoylePlayer];
          } else if (square?.playerId && square?.playerId !== playerID) {
            const elementGargoyleEnemy = <GargoyleEnemy isRotated={isPlayerHost} coordinates={coordinates} />;
            gridNew[key] = [...(gridNew[key] || []), elementGargoyleEnemy];
          }
        }
      });
    });
    setGrid(gridNew);
  }, [board, yourTurn]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const gridClone = _.cloneDeep(grid);
    keys.map((row, indexRow) => {
      board[row].squares.map((square, indexColumn) => {
        const coordinates: Coordinates = { x: indexColumn, y: indexRow };
        const key = stringifyCoordinates(coordinates);
        if (square.type === SquareTypes.Player && square.isAvailable) {
          if (isPressed) {
            const elementNextMove = (
              <NextMoveTile
                coordinates={coordinates}
                handleMovePlayer={() =>
                  ws.send(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Player, coordinates }))
                }
              />
            );
            gridClone[key] = [...(gridClone[key] || []), elementNextMove];
          } else {
            gridClone[key] = [];
          }
        }
      });
    });
    setGrid(gridClone);
  }, [isPressed]);

  return <>{_.flatMap(Object.keys(grid).map((key) => grid[key]))}</>;
};

export default Grid;
