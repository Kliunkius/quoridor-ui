import { useMemo, useState } from 'react';
import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import useWebsocketClient, { formatMessage } from '../../hooks/useWebsocketClient';
import { Board } from '../grid/SquareTypes';
import './Room.css';
import { MessageTypes } from '../../hooks/websocketTypes';
import Grid from '../grid/Grid';
import StaticBoard from '../board/StaticBoard';
import { Canvas } from '@react-three/fiber';
import { CAMERA_STARTING_POSITION } from '../constants';

type Player = {
  ready: boolean;
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
        setCookie('userId', props.userId);
        setOtherPlayer(props.otherPlayer);
        setYourName(props.yourName);
        setBoard(props.board);
      },
      [MessageTypes.READY]: (props: any) => {
        setYourTurn(props.yourTurn);
        setBoard(props.board);
      },
      [MessageTypes.RECONNECT]: (props: any) => {
        setBoard(props.board);
        setYourTurn(props.yourTurn);
      },
      [MessageTypes.MOVE]: (props: any) => {
        setBoard(props.board);
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

  if (playerReady) console.log('You are ready');
  if (otherPlayer?.ready) console.log('Other player is ready');

  return (
    <>
      {!_.isEmpty(board) && (
        <div className="body">
          <Canvas
            flat
            linear
            camera={{
              position: CAMERA_STARTING_POSITION
            }}
          >
            <StaticBoard />
            <Grid board={board} ws={ws} yourTurn={yourTurn} playerID={cookies.userId} />
          </Canvas>
          <div className="user-information">
            {yourTurn && playerReady && !_.isEmpty(otherPlayer) && <div>Your turn</div>}
            {!yourTurn && playerReady && !_.isEmpty(otherPlayer) && <div>Enemy's turn</div>}
            {_.isEmpty(otherPlayer) && <div>waiting for opponent to join</div>}
            {!_.isEmpty(otherPlayer) && playerReady && !otherPlayer?.ready && (
              <div>waiting for opponent to ready up</div>
            )}
            <div>Your name: {yourName}</div>
            {otherPlayer && <div>Enemy name: {otherPlayer.name}</div>}
            {!playerReady && !_.isEmpty(otherPlayer) && (
              <button className="button-ready" onClick={() => handleReadyClick()}>
                Ready
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Room;
