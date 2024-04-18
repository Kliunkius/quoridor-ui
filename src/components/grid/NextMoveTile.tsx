import { CORNER_POSITION, SURFACE_ELEVATION } from '../constants';
import { Coordinates } from './SquareTypes';

type PropsNextMove = {
  coordinates: Coordinates;
  handleMovePlayer: () => void;
};
const NextMoveTile: React.FC<PropsNextMove> = ({ coordinates, handleMovePlayer }) => {
  return (
    <mesh
      position={[CORNER_POSITION + coordinates.x / 2, SURFACE_ELEVATION, CORNER_POSITION + coordinates.y / 2]}
      scale={[0.65, 0.01, 0.65]}
      onClick={() => handleMovePlayer()}
    >
      <boxGeometry />
      <meshBasicMaterial transparent opacity={0.5} color={'lime'} />
    </mesh>
  );
};

export default NextMoveTile;
