import { useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { CAMERA_MOVE_SPEED, CAMERA_TARGET_POSITION } from '../constants';

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
  useFrame((state, delta) => {
    if (isMouseUp) {
      state.camera.position.lerp({ x, y, z }, delta * CAMERA_MOVE_SPEED);
      state.camera.lookAt(CAMERA_TARGET_POSITION, CAMERA_TARGET_POSITION, CAMERA_TARGET_POSITION);
    }
  });
  return null;
};
export default CameraRig;
