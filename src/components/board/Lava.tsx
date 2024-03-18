import LavaTile from './LavaTile';

interface LavaProps {
  position: [number, number, number];
}

const Lava: React.FC<LavaProps> = ({ position }) => {
  const x = position[0];
  const y = position[1];
  const z = position[2];
  const TILE_WIDTH = 30;
  return (
    <>
      <LavaTile position={[x - TILE_WIDTH, y, z - TILE_WIDTH]} />
      <LavaTile position={[x - TILE_WIDTH, y, z]} />
      <LavaTile position={[x - TILE_WIDTH, y, z + TILE_WIDTH]} />
      <LavaTile position={[x, y, z - TILE_WIDTH]} />
      <LavaTile position={[x, y, z]} />
      <LavaTile position={[x, y, z + TILE_WIDTH]} />
      <LavaTile position={[x + TILE_WIDTH, y, z - TILE_WIDTH]} />
      <LavaTile position={[x + TILE_WIDTH, y, z]} />
      <LavaTile position={[x + TILE_WIDTH, y, z + TILE_WIDTH]} />
    </>
  );
};

export default Lava;
