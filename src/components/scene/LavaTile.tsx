import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import imgLava from '../objects/map.png';
import { LAVA_SCALE } from './constants';

interface LavaTileProps {
  position: [number, number, number];
}

const LavaTile: React.FC<LavaTileProps> = ({ position }) => {
  const base = useLoader(THREE.TextureLoader, imgLava);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={LAVA_SCALE} />
      <meshPhysicalMaterial map={base} />
    </mesh>
  );
};

export default LavaTile;
