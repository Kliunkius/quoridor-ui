import { useCallback, useState } from 'react';
import _ from 'lodash';
import { useCookies } from 'react-cookie';

import useWebsocketClient from '../../hooks/useWebsocketClient';
import TestBoard from '../board/TestBoard';
import { Board } from '../board/types';
import './Room.css';

const Room = () => {
  const [board, setBoard] = useState<Board>({});
  const handleBoardChange = useCallback((board: Board) => setBoard(board), [setBoard]);

  const [cookies] = useCookies<string>(['userId']);

  const ws = useWebsocketClient(handleBoardChange);

  return _.isEmpty(board) ? (
    <></>
  ) : (
    <div className="container">
      <TestBoard board={board} ws={ws} playerId={cookies.userId} />
    </div>
  );
};

export default Room;
