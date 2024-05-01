import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import useWebsocketClient, { formatMessage } from '../../hooks/useWebsocketClient';
import { Board, SquareTypes } from '../grid/SquareTypes';
import './Room.css';
import { MessageTypes } from '../../hooks/websocketTypes';
import Grid from '../grid/Grid';
import StaticBoard from '../board/StaticBoard';
import { Canvas } from '@react-three/fiber';
import { CAMERA_DEFAULT_POSITION, CAMERA_STARTING_POSITION } from '../constants';
import CameraRig from '../board/CameraRig';

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
  const [isPlayerHost, setIsPlayerHost] = useState<boolean>(false);
  const [boardLoaded, setBoardLoaded] = useState<boolean>(false);

  const [cookies, setCookie, removeCookie] = useCookies<string>(['userId']);
  const [cookieIsHost, setCookieIsHost, removeCookieIsHost] = useCookies<string>(['isHost']);
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
        // setCookie('isHost', props.isHost);
        setBoard(props.board);
        setYourTurn(props.yourTurn);
      },
      [MessageTypes.MOVE]: (props: any) => {
        setBoard(props.board);
        setYourTurn(props.yourTurn);
      },
      [MessageTypes.ROOM_DELETED]: (props: any) => {
        removeCookie('userId');
        removeCookieIsHost('isHost');
        navigate(`/`);
      }
    };
  }, []);

  useEffect(() => {
    if (!boardLoaded) {
      if (board[16]?.squares[8]?.type !== SquareTypes.Player) return;
      setIsPlayerHost(board[16].squares[8].playerId === cookies.userId || cookieIsHost.isHost === true);
      setBoardLoaded(true);
    }
  }, [board]);

  useEffect(() => {
    if (cookieIsHost.isHost === true) {
      return;
    }
    if (isPlayerHost) {
      setCookieIsHost('isHost', 'true');
    } else setCookieIsHost('isHost', 'false');
  }, [isPlayerHost]);

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
              position: isPlayerHost
                ? CAMERA_STARTING_POSITION
                : [CAMERA_STARTING_POSITION[0], CAMERA_STARTING_POSITION[1], -CAMERA_STARTING_POSITION[2]]
            }}
          >
            <CameraRig
              position={
                isPlayerHost
                  ? CAMERA_DEFAULT_POSITION
                  : [CAMERA_DEFAULT_POSITION[0], CAMERA_DEFAULT_POSITION[1], -CAMERA_DEFAULT_POSITION[2]]
              }
            />
            <StaticBoard />
            <Grid board={board} ws={ws} yourTurn={yourTurn} playerID={cookies.userId} isPlayerHost={isPlayerHost} />
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
