import { CORNER_POSITION, SURFACE_ELEVATION } from '../constants';
import { Coordinates } from './SquareTypes';

type PropsBoardTile = {
  coordinates: Coordinates;
  opacity: number;
  color: string;
  onClickFunction: () => void;
};
const BoardTile: React.FC<PropsBoardTile> = ({ coordinates, opacity, color, onClickFunction }) => {
  return (
    <mesh
      position={[CORNER_POSITION + coordinates.x / 2, SURFACE_ELEVATION, CORNER_POSITION + coordinates.y / 2]}
      scale={[0.65, 0.01, 0.65]}
      onClick={() => onClickFunction()}
    >
      <boxGeometry />
      <meshBasicMaterial transparent opacity={opacity} color={color} />
    </mesh>
  );
};

export default BoardTile;
