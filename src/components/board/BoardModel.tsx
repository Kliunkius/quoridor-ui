// @ts-ignore
import boardPath from '../objects/Board.glb';
import { useGLTF } from '@react-three/drei';

interface BoardProps {
  position: [number, number, number];
}

const BoardModel: React.FC<BoardProps> = ({ position }) => {
  const gltf = useGLTF(boardPath);
  // @ts-ignore
  return <primitive object={gltf.scene} position={position} />;
};

export default BoardModel;
