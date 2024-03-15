import * as constants from '../constants';
import BoardModel from './BoardModel';
import Lava from './Lava';
import { OrbitControls } from '@react-three/drei';
import CameraRig from './CameraRig';

const StaticBoard = () => {
  return (
    <>
      <CameraRig position={constants.CAMERA_DEFAULT_POSITION} />
      <fog attach="fog" args={constants.FOG_PROPERTIES} />
      <ambientLight color="white" intensity={constants.AMBIENT_LIGHT_INTENSITY} />
      <mesh position={constants.BOARD_STARTING_POSITION}>
        <BoardModel position={constants.BOARD_STARTING_POSITION} />
        <meshBasicMaterial />
      </mesh>
      <Lava position={constants.LAVA_STARTING_POSITION} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={constants.MAX_CAMERA_POLAR_ANLGE}
        minPolarAngle={constants.MIN_CAMERA_POLAR_ANLGE}
      />
    </>
  );
};

export default StaticBoard;
