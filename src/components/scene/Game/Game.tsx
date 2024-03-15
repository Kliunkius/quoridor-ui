import { Canvas, useFrame } from '@react-three/fiber';
import * as constants from '../constants';
import './Game.css';
import BoardModel from '../Board';
import Lava from '../Lava';
import { Board } from '../../board-real/RealTypes';
import RealBoard from '../../board-real/RealBoard';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useState } from 'react';

interface CameraRigProps {
  position: [number, number, number];
}
const CameraRig: React.FC<CameraRigProps> = ({ position }) => {
  const [isMouseUp, setIsMouseUp] = useState(true);
  const x = position[0],
    y = position[1],
    z = position[2];

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseUp(true);
    };

    const handleMouseDown = () => {
      setIsMouseUp(false);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  useFrame((state) => {
    if (isMouseUp) {
      state.camera.position.lerp({ x, y, z }, 0.08);
      state.camera.lookAt(0, 0, 0);
    }
  });
  return null;
};

const Game = () => {
  return (
    <>
      <CameraRig position={constants.CAMERA_DEFAULT_POSITION} />
      <ambientLight color="white" intensity={3} />
      <mesh position={constants.BOARD_STARTING_POSITION}>
        <BoardModel position={constants.BOARD_STARTING_POSITION} />
        <meshBasicMaterial />
      </mesh>
      <Lava position={constants.LAVA_STARTING_POSITION} />
      <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI * 0.47} minPolarAngle={0.2} />
    </>
  );
};

export default Game;
