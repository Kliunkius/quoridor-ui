import _ from 'lodash';
import { useEffect, useState } from 'react';

import { Board, BoardSquare, RowTypes, SquareTypes, Coordinates } from './RealTypes';
import { formatMessage } from '../../hooks/useWebsocketClient';
import { MessageTypes } from '../../hooks/websocketTypes';

type PropsWall = {
  coordinates: Coordinates;
};
// const Wall: React.FC<PropsWall> = ({ position, rotation, color, opacity }) => {
const Wall: React.FC<PropsWall> = ({ coordinates }) => {
  const isRotated = coordinates.y % 2 === 0;

  return (
    <mesh
      position={[
        isRotated ? cornerPositionX + coordinates.x / 2 : cornerPositionX + coordinates.x / 2 + 0.5,
        0.3,
        isRotated ? cornerPositionY + coordinates.y / 2 - 0.5 : cornerPositionY + coordinates.y / 2
      ]}
      scale={[1.8, 0.7, 0.18]}
      rotation={isRotated ? [0, Math.PI / 2, 0] : [0, 0, 0]}
    >
      <boxGeometry />
      <meshBasicMaterial color={'orange'} transparent opacity={0.7} />
    </mesh>
  );
};

type PropsHitbox = {
  coordinates: Coordinates;
  ws: WebSocket;
};
const Hitbox: React.FC<PropsHitbox> = ({ coordinates, ws }) => {
  const isRotated = coordinates.y % 2 === 0;
  return (
    <mesh
      position={[cornerPositionX + coordinates.x / 2, 0.3, cornerPositionY + coordinates.y / 2]}
      scale={[0.7, 0.01, 0.3]}
      rotation={isRotated ? [0, Math.PI / 2, 0] : [0, 0, 0]}
      onClick={() => {
        console.log(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Wall, coordinates }));
        ws.send(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Wall, coordinates }));
      }}
    >
      <boxGeometry />
      <meshBasicMaterial transparent opacity={0.5} />
    </mesh>
  );
};

type PropsHitboxUnavailable = {
  coordinates: Coordinates;
};
const HitboxUnavailable: React.FC<PropsHitboxUnavailable> = ({ coordinates }) => {
  const isRotated = coordinates.y % 2 === 0;
  return (
    <mesh
      position={[cornerPositionX + coordinates.x / 2, 0.3, cornerPositionY + coordinates.y / 2]}
      scale={[0.7, 0.01, 0.3]}
      rotation={isRotated ? [0, Math.PI / 2, 0] : [0, 0, 0]}
    >
      <boxGeometry />
      <meshBasicMaterial transparent opacity={0.5} color={'red'} />
    </mesh>
  );
};

const cornerPositionX = -4.5;
const cornerPositionY = -4;

type Props = {
  board: Board;
  ws: WebSocket;
  playerId: string;
  yourTurn: boolean;
};
const RealBoard: React.FC<Props> = ({ board, ws, playerId, yourTurn }) => {
  const [move, setMove] = useState('');

  const [grid, setGrid] = useState([<mesh></mesh>]);

  const keys = Object.keys(board).map((key) => Number(key));

  let indexRow = 0;
  keys.map((row) => {
    let indexColumn = 0;
    board[row].squares.map((square) => {
      indexColumn++;
      if (square.type === SquareTypes.Wall) {
        const coordinates: Coordinates = { x: indexColumn, y: indexRow };
        if (square.isAvailable) {
          grid.push(<Hitbox coordinates={coordinates} ws={ws} />);
        } else if (!square.isAvailable && square.isWalkable) {
          grid.push(<HitboxUnavailable coordinates={coordinates} />);
        } else if (square.isPlaced) {
          grid.push(<Wall coordinates={coordinates} />);
        }
      }
    });
    indexRow++;
  });

  return <>{grid}</>;
};

export default RealBoard;
