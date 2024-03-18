import { CORNER_POSITION, SURFACE_ELEVATION, WALL_SCALE } from '../constants';
import { Coordinates } from './SquareTypes';

const WALL_OFFSET = 0.5;
const WALL_OPACITY = 0.7;

type PropsWall = {
  coordinates: Coordinates;
  color: string;
};
const Wall: React.FC<PropsWall> = ({ coordinates, color }) => {
  const isRotated = coordinates.y % 2 === 0;
  return (
    <mesh
      position={[
        isRotated ? CORNER_POSITION + coordinates.x / 2 : CORNER_POSITION + coordinates.x / 2 + WALL_OFFSET,
        SURFACE_ELEVATION,
        isRotated ? CORNER_POSITION + coordinates.y / 2 - WALL_OFFSET : CORNER_POSITION + coordinates.y / 2
      ]}
      scale={WALL_SCALE}
      rotation={isRotated ? [0, Math.PI / 2, 0] : [0, 0, 0]}
    >
      <boxGeometry />
      <meshBasicMaterial color={color} transparent opacity={WALL_OPACITY} />
    </mesh>
  );
};

export default Wall;
