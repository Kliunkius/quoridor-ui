import { Canvas } from '@react-three/fiber';
import * as constants from '../constants';
import './Game.css';
import Board from '../Board';
import Lava from '../Lava';

const Game = () => {
  return (
    <div id="game">
      <Canvas
        flat
        linear
        camera={{
          position: constants.CAMERA_DEFAULT_POSITION
        }}
      >
        <ambientLight color="white" intensity={3} />
        <mesh position={constants.BOARD_STARTING_POSITION}>
          <Board position={constants.BOARD_STARTING_POSITION} />
          <meshBasicMaterial />
        </mesh>
        <Lava position={constants.LAVA_STARTING_POSITION} />
      </Canvas>
    </div>
  );
};

export default Game;
