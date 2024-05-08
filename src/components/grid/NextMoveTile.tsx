import BoardTile from './BoardTile';
import { Coordinates } from './SquareTypes';

type PropsNextMove = {
  coordinates: Coordinates;
  handleMovePlayer: () => void;
};
const NextMoveTile: React.FC<PropsNextMove> = ({ coordinates, handleMovePlayer }) => {
  return <BoardTile coordinates={coordinates} opacity={0.5} color={'lime'} onClickFunction={handleMovePlayer} />;
};

export default NextMoveTile;
