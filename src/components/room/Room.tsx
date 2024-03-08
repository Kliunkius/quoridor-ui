import { useMemo, useState } from 'react';
import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import useWebsocketClient, { formatMessage } from '../../hooks/useWebsocketClient';
import TestBoard from '../board/TestBoard';
import { Board } from '../board/types';
import './Room.css';
import { MessageTypes } from '../../hooks/websocketTypes';

type Player = {
  ready: boolean;
  isYou: boolean;
  name: string;
};

const Room = () => {
  const [board, setBoard] = useState<Board>({});
  const [otherPlayer, setOtherPlayer] = useState<Player | undefined>(undefined);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [yourTurn, setYourTurn] = useState<boolean>(false);
  const [yourName, setYourName] = useState<string>('');

  const [cookies, setCookie, removeCookie] = useCookies<string>(['userId']);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const handleBoardChangeMap = useMemo(() => {
    return {
      [MessageTypes.JOIN_ROOM]: (props: any) => {
        console.log('nu labas');
        setCookie('userId', props.userId);
        setOtherPlayer(props.otherPlayer);
        setYourName(props.yourName);
        setYourTurn(props.yourTurn);
      },
      [MessageTypes.READY]: (props: any) => {
        setBoard(props.board);
      },
      [MessageTypes.RECONNECT]: (props: any) => {
        setBoard(props.board);
      },
      [MessageTypes.MOVE]: (props: any) => {
        setBoard(props.board);
        console.log('props.yourTurn', props.yourTurn);
        setYourTurn(props.yourTurn);
      },
      [MessageTypes.ROOM_DELETED]: (props: any) => {
        removeCookie('userId');
        navigate(`/`);
      }
    };
  }, []);

  const ws = useWebsocketClient(handleBoardChangeMap, cookies.userId, roomCode || '');

  const handleReadyClick = () => {
    setPlayerReady(true);
    ws.send(formatMessage(MessageTypes.READY, {}));
  };

  return (
    <>
      {_.isEmpty(otherPlayer) && <div>waiting for opponent to join</div>}
      {!_.isEmpty(otherPlayer) && playerReady && !otherPlayer.ready && <div>waiting for opponent to ready up</div>}
      <div className="player-container">
        <div>
          <span>{yourName + '(You)'}</span>
          {playerReady && <span className="checkmark">+</span>}
        </div>
        {otherPlayer && (
          <div>
            <span>{otherPlayer.name}</span>
            {otherPlayer.ready && <span className="checkmark">+</span>}
          </div>
        )}
      </div>
      <div className="container">
        {!_.isEmpty(board) ? (
          <TestBoard board={board} ws={ws} playerId={cookies.userId} yourTurn={yourTurn} />
        ) : (
          !playerReady && <button onClick={handleReadyClick}>Ready</button>
        )}
      </div>
    </>
  );
};

export default Room;
