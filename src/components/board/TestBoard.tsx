import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import './TestBoard.css';
import { Board, RowTypes, SquareTypes } from './types';
import useWebsocketClient, { formatMessage } from '../../hooks/useWebsocketClient';
import { Coordinates, MessageTypes } from '../../hooks/websocketTypes';

const TestBoard = () => {
  const { roomCode } = useParams();
  console.log('roomCode', roomCode);

  const [move, setMove] = useState('');
  const [cookies] = useCookies<string>(['']);
  const [board, setBoard] = useState<Board>({});
  const playerId = cookies['userId'];

  const ws = useWebsocketClient(roomCode || '', (board: Board) => setBoard(board));
  const keys = Object.keys(board).map((key) => Number(key));
  let indexY = -1;

  const handlePlaceWall = () => {
    if (_.isEmpty(move)) {
      return;
    }

    const moveCoordinates = move.split('-');
    const coordinates: Coordinates = { x: Number(moveCoordinates[1]), y: Number(moveCoordinates[0]) };

    ws.send(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Wall, coordinates }));
  };

  const handleMovePlayer = () => {
    if (_.isEmpty(move)) {
      return;
    }
  };

  const handleInputChange = (event: any) => {
    setMove(event.target.value);
  };

  return (
    <div className="container">
      <table>
        {keys.map((key) => {
          const row = board[key].row;
          let indexX = 0;
          indexY++;
          const squares = row.map((square) => {
            let className = '';
            if (square.type === SquareTypes.Player) {
              className = 'square';
              if (!_.isEmpty(square.playerId)) {
                className += square.playerId === playerId ? ' player' : ' opponent';
              }
            }
            if (square.type === SquareTypes.Wall) {
              className = 'wall';
              if (square.isPlaced) {
                className += ' placed';
              }
            }

            return (
              <td className={className}>
                {indexY}-{indexX++}
              </td>
            );
          });

          const className = board[key].type === RowTypes.Mixed ? 'mixed-row' : 'wall-row';
          return <tr className={className}>{squares}</tr>;
        })}
      </table>
      <div className="game-container">
        <input
          type="text"
          placeholder="Enter square coordinates"
          value={move}
          onChange={handleInputChange}
          className="textbox"
        />
        <div className="button-container">
          <button onClick={handlePlaceWall}>Place Wall</button>
          <button onClick={handleMovePlayer}>Move Player</button>
        </div>
      </div>
    </div>
  );
};

export default TestBoard;
