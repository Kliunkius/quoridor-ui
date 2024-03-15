import { useState } from 'react';
import { Coordinates } from './SquareTypes';
import { CORNER_POSITION, HITBOX_SCALE, SURFACE_ELEVATION } from '../constants';
import Wall from './Wall';

type PropsHitboxUnavailable = {
  coordinates: Coordinates;
};
const HitboxUnavailable: React.FC<PropsHitboxUnavailable> = ({ coordinates }) => {
  const isRotated = coordinates.y % 2 === 0;
  const [isHover, setIsHover] = useState(false);
  return (
    <>
      <mesh
        position={[CORNER_POSITION + coordinates.x / 2, SURFACE_ELEVATION, CORNER_POSITION + coordinates.y / 2]}
        scale={HITBOX_SCALE}
        rotation={isRotated ? [0, Math.PI / 2, 0] : [0, 0, 0]}
        onPointerEnter={() => setIsHover(true)}
        onPointerLeave={() => setIsHover(false)}
      >
        <boxGeometry />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {isHover && <Wall coordinates={coordinates} color="red" />}
    </>
  );
};

export default HitboxUnavailable;
