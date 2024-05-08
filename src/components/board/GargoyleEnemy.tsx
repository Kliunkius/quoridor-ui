import { useGLTF } from '@react-three/drei';
import { Coordinates } from '../grid/SquareTypes';
// @ts-ignore
import gargoyleRedPath from '../objects/gargoyle_red.glb';
import { CORNER_POSITION, GARGOYLE_OFFSET, GARGOYLE_SCALE } from '../constants';

interface GargoyleProps {
  isRotated: boolean;
  coordinates: Coordinates;
}

const GargoyleEnemy: React.FC<GargoyleProps> = ({ isRotated, coordinates }) => {
  const gltf = useGLTF(gargoyleRedPath);

  const position = isRotated
    ? [
        CORNER_POSITION - GARGOYLE_OFFSET[0] + coordinates.x / 2,
        GARGOYLE_OFFSET[1],
        CORNER_POSITION - GARGOYLE_OFFSET[2] + coordinates.y / 2
      ]
    : [
        CORNER_POSITION + GARGOYLE_OFFSET[0] + coordinates.x / 2,
        GARGOYLE_OFFSET[1],
        CORNER_POSITION + GARGOYLE_OFFSET[2] + coordinates.y / 2
      ];

  const rotation = isRotated ? [0, -Math.PI / 2, 0] : [0, Math.PI / 2, 0];

  return (
    <primitive
      // @ts-ignore
      object={gltf.scene}
      position={position}
      scale={GARGOYLE_SCALE}
      rotation={rotation}
    />
  );
};

export default GargoyleEnemy;
