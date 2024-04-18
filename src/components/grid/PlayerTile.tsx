import { useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { Coordinates } from './SquareTypes';
import { CORNER_POSITION, SURFACE_ELEVATION } from '../constants';

type PropsPlayerTile = {
  coordinates: Coordinates;
  handleOnClick: () => void;
};
const PlayerTile: React.FC<PropsPlayerTile> = ({ coordinates, handleOnClick }) => {
  const [opacity, setOpacity] = useState(0);
  useFrame((state) => {
    setOpacity(Math.abs(Math.sin(state.clock.elapsedTime)));
  });
  return (
    <mesh
      position={[CORNER_POSITION + coordinates.x / 2, SURFACE_ELEVATION, CORNER_POSITION + coordinates.y / 2]}
      scale={[0.65, 0.01, 0.65]}
      onClick={() => handleOnClick()}
    >
      <boxGeometry />
      <meshBasicMaterial transparent opacity={opacity} color={'#00C9FF'} />
    </mesh>
  );
};

export default PlayerTile;
