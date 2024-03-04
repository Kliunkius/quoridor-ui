import LavaTile from './LavaTile';

interface LavaProps {
  position: [number, number, number];
}

const Lava: React.FC<LavaProps> = ({ position }) => {
  const x = position[0];
  const y = position[1];
  const z = position[2];
  const tileWidth = 30;
  return (
    <>
      <LavaTile position={[x - tileWidth, y, z - tileWidth]} />
      <LavaTile position={[x - tileWidth, y, z]} />
      <LavaTile position={[x - tileWidth, y, z + tileWidth]} />
      <LavaTile position={[x, y, z - tileWidth]} />
      <LavaTile position={[x, y, z]} />
      <LavaTile position={[x, y, z + tileWidth]} />
      <LavaTile position={[x + tileWidth, y, z - tileWidth]} />
      <LavaTile position={[x + tileWidth, y, z]} />
      <LavaTile position={[x + tileWidth, y, z + tileWidth]} />
    </>
  );
};

export default Lava;
