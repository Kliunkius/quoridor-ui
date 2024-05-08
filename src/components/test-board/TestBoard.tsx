import _ from 'lodash';
import { useState } from 'react';

import { Board, RowTypes, SquareType } from './types';
import { formatMessage } from '../../hooks/useWebsocketClient';
import { Coordinates, MessageTypes } from '../../hooks/websocketTypes';
import './TestBoard.css';

type Props = {
  board: Board;
  ws: WebSocket;
  playerId: string;
  yourTurn: boolean;
};
const TestBoard: React.FC<Props> = ({ board, ws, playerId, yourTurn }) => {
  const [move, setMove] = useState('');

  const keys = Object.keys(board).map((key) => Number(key));
  const handlePlaceWall = () => {
    if (_.isEmpty(move)) {
      return;
    }

    const moveCoordinates = move.split('-');
    const coordinates: Coordinates = { y: Number(moveCoordinates[0]), x: Number(moveCoordinates[1]) };

    ws.send(formatMessage(MessageTypes.MOVE, { type: SquareType.Wall, coordinates }));
  };

  const handleMovePlayer = () => {
    if (_.isEmpty(move)) {
      return;
    }

    const moveCoordinates = move.split('-');
    const coordinates: Coordinates = { y: Number(moveCoordinates[0]), x: Number(moveCoordinates[1]) };

    ws.send(formatMessage(MessageTypes.MOVE, { type: SquareType.Player, coordinates }));
  };

  const handleInputChange = (event: any) => {
    setMove(event.target.value);
  };

  return (
    <div className="container">
      <table>
        <tbody>
          {keys.map((key, indexY) => {
            const squares = board[key].squares;
            const renderedSquares = squares.map((square, indexX) => {
              let className = '';
              if (square.type === SquareType.Player) {
                className = 'square';
                if (!_.isEmpty(square.playerId)) {
                  className += square.playerId === playerId ? ' player' : ' opponent';
                }
              }
              if (square.type === SquareType.Wall) {
                className = 'wall';

                let hasClass = false;

                if (board[key].type === RowTypes.Mixed) {
                  if (
                    square.isPlaced ||
                    // @ts-ignore
                    board[key + 1]?.squares[indexX].isPlaced ||
                    // @ts-ignore
                    board[key + 2]?.squares[indexX].isPlaced
                  ) {
                    hasClass = true;
                    className += ' placed';
                  }
                } else {
                  if (indexX % 2 === 0) {
                    if (
                      square.isPlaced ||
                      // @ts-ignore
                      squares[indexX - 1]?.isPlaced ||
                      // @ts-ignore
                      squares[indexX - 2]?.isPlaced
                    ) {
                      hasClass = true;
                      className += ' placed';
                    }
                  } else {
                    if (
                      square.isPlaced ||
                      // @ts-ignore
                      squares[indexX - 1]?.isPlaced ||
                      // @ts-ignore
                      board[key + 1]?.squares[indexX].isPlaced
                    ) {
                      hasClass = true;
                      className += ' placed';
                    }
                  }
                }
                if (!hasClass) {
                  className += square.isAvailable ? ' available' : ' unavailable';
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
