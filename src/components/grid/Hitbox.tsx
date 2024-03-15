import { useState } from 'react';
import { Coordinates, SquareTypes } from './SquareTypes';
import { formatMessage } from '../../hooks/useWebsocketClient';
import { MessageTypes } from '../../hooks/websocketTypes';
import { CORNER_POSITION, HITBOX_SCALE, SURFACE_ELEVATION } from '../constants';
import Wall from './Wall';

type PropsHitbox = {
  coordinates: Coordinates;
  ws: WebSocket;
};
const Hitbox: React.FC<PropsHitbox> = ({ coordinates, ws }) => {
  const isRotated = coordinates.y % 2 === 0;
  const [isHover, setIsHover] = useState(false);
  const handlePlaceWall = () => {
    ws.send(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Wall, coordinates }));
  };
  return (
    <>
      <mesh
        position={[CORNER_POSITION + coordinates.x / 2, SURFACE_ELEVATION, CORNER_POSITION + coordinates.y / 2]}
        scale={HITBOX_SCALE}
        rotation={isRotated ? [0, Math.PI / 2, 0] : [0, 0, 0]}
        onPointerEnter={() => setIsHover(true)}
        onPointerLeave={() => setIsHover(false)}
        onClick={() => {
          handlePlaceWall();
        }}
      >
        <boxGeometry />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {isHover && <Wall coordinates={coordinates} color="lime" />}
    </>
  );
};

export default Hitbox;
