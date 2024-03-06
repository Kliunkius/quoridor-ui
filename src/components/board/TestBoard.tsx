import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { useState } from 'react';

import './TestBoard.css';
import { Board, BoardTypes, RowTypes, createNewBoard } from './types';

const TestBoard = () => {
  const board: Board = createNewBoard();
  const keys = Object.keys(board).map((key) => Number(key));
  let indexY = -1;

  const [roomCode, setRoomCode] = useState('');
  const [cookies] = useCookies<string>(['']);
  const playerId = cookies['userId'];

  const handleJoinGame = () => {};

  const handleCreateGame = async () => {
    if (_.isEmpty(roomCode)) {
      return;
    }
  };

  const handleInputChange = (event: any) => {
    setRoomCode(event.target.value);
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
            if (square.type === BoardTypes.Square) {
              className = 'square';
              if (!_.isEmpty(square.playerId)) {
                className += square.playerId === playerId ? ' player' : ' opponent';
              }
            }
            if (square.type === BoardTypes.Wall) {
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
          placeholder="Enter room code"
          value={roomCode}
          onChange={handleInputChange}
          className="textbox"
        />
        <div className="button-container">
          <button onClick={handleJoinGame}>Join Game</button>
          <button onClick={handleCreateGame}>Create Game</button>
        </div>
      </div>
    </div>
  );
};

export default TestBoard;
