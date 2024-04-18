import { useGLTF } from '@react-three/drei';
import { Coordinates } from '../grid/SquareTypes';
// @ts-ignore
import gargoyleBluePath from '../objects/gargoyle_blue.glb';
// @ts-ignore
import gargoyleRedPath from '../objects/gargoyle_red.glb';
import { CORNER_POSITION, GARGOYLE_OFFSET, GARGOYLE_SCALE } from '../constants';

interface GargoyleProps {
  isEnemy: boolean;
  coordinates: Coordinates;
}
const Gargoyle: React.FC<GargoyleProps> = ({ isEnemy, coordinates }) => {
  const gltf = useGLTF(!isEnemy ? gargoyleBluePath : gargoyleRedPath);
  // @ts-ignore
  return (
    <primitive
      // @ts-ignore
      object={gltf.scene}
      position={
        !isEnemy
          ? [
              CORNER_POSITION + GARGOYLE_OFFSET[0] + coordinates.x / 2,
              GARGOYLE_OFFSET[1],
              CORNER_POSITION + GARGOYLE_OFFSET[2] + coordinates.y / 2
            ]
          : [
              CORNER_POSITION - GARGOYLE_OFFSET[0] + coordinates.x / 2,
              GARGOYLE_OFFSET[1],
              CORNER_POSITION - GARGOYLE_OFFSET[2] + coordinates.y / 2
            ]
      }
      scale={GARGOYLE_SCALE}
      rotation={!isEnemy ? [0, Math.PI / 2, 0] : [0, -Math.PI / 2, 0]}
    />
  );
};

export default Gargoyle;
