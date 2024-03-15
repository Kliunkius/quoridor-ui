import _ from 'lodash';
import { useState } from 'react';

import { Board, RowTypes, SquareTypes } from './types';
import { formatMessage } from '../../hooks/useWebsocketClient';
import { Coordinates, MessageTypes } from '../../hooks/websocketTypes';

type Props = {
  board: Board;
  ws: WebSocket;
  playerId: string;
  yourTurn: boolean;
};
const TestBoard: React.FC<Props> = ({ board, ws, playerId, yourTurn }) => {
  const [move, setMove] = useState('');

  const keys = Object.keys(board).map((key) => Number(key));
  let indexY = -1;

  const handlePlaceWall = () => {
    if (_.isEmpty(move)) {
      return;
    }

    const moveCoordinates = move.split('-');
    const coordinates: Coordinates = { y: Number(moveCoordinates[0]), x: Number(moveCoordinates[1]) };

    ws.send(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Wall, coordinates }));
  };

  const handleMovePlayer = () => {
    if (_.isEmpty(move)) {
      return;
    }

    const moveCoordinates = move.split('-');
    const coordinates: Coordinates = { y: Number(moveCoordinates[0]), x: Number(moveCoordinates[1]) };

    ws.send(formatMessage(MessageTypes.MOVE, { type: SquareTypes.Player, coordinates }));
  };

  const handleInputChange = (event: any) => {
    setMove(event.target.value);
  };

  return (
    <div className="container">
      <table>
        <tbody>
          {keys.map((key) => {
            const squares = board[key].squares;
            let indexX = 0;
            indexY++;
            const renderedSquares = squares.map((square) => {
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
                <td key={`${indexY}-${indexX}`} className={className}>
                  {indexY}-{indexX++}
                </td>
              );
            });

            const className = board[key].type === RowTypes.Mixed ? 'mixed-row' : 'wall-row';
            return (
              <tr key={indexY} className={className}>
                {renderedSquares}
              </tr>
            );
          })}
        </tbody>
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
          {yourTurn ? <div>Your turn</div> : <div>Wait for your turn</div>}
          <button onClick={handlePlaceWall} disabled={!yourTurn}>
            Place Wall
          </button>
          <button onClick={handleMovePlayer} disabled={!yourTurn}>
            Move Player
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestBoard;
