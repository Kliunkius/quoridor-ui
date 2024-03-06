import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import imgLava from '../objects/map.png';
import imgEmission from '../objects/emission.png';
import { LAVA_SCALE } from './constants';
import { useState } from 'react';

interface LavaTileProps {
  position: [number, number, number];
}

const LavaTile: React.FC<LavaTileProps> = ({ position }) => {
  const base = useLoader(THREE.TextureLoader, imgLava);
  const emission = useLoader(THREE.TextureLoader, imgEmission);
  const [emissionMultiplier, setEmissionMultiplier] = useState(1.5);
  useFrame((state) => {
    setEmissionMultiplier(Math.sin(state.clock.elapsedTime) + 1);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={LAVA_SCALE} />
      <meshPhysicalMaterial
        map={base}
        toneMapped={false}
        emissiveMap={emission}
        emissive={'orange'}
        emissiveIntensity={emissionMultiplier}
      />
    </mesh>
  );
};

export default LavaTile;
