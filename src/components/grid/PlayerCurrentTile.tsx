import { useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { Coordinates } from './SquareTypes';
import BoardTile from './BoardTile';

type PropsCurrentPlayerTile = {
  coordinates: Coordinates;
  handleOnClick: () => void;
};
const PlayerCurrentTile: React.FC<PropsCurrentPlayerTile> = ({ coordinates, handleOnClick }) => {
  const [opacity, setOpacity] = useState(0);
  useFrame((state) => {
    setOpacity(Math.abs(Math.sin(state.clock.elapsedTime * 2)));
  });
  return <BoardTile coordinates={coordinates} opacity={opacity} color={'#00C9FF'} onClickFunction={handleOnClick} />;
};

export default PlayerCurrentTile;
