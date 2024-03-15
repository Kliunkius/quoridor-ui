import { useMemo, useState } from 'react';
import _ from 'lodash';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import useWebsocketClient, { formatMessage } from '../../hooks/useWebsocketClient';
import TestBoard from '../board/TestBoard';
import { Board } from '../board/types';
// import { Board } from '../board-real/RealTypes';
import './Room.css';
import { MessageTypes } from '../../hooks/websocketTypes';
import RealBoard from '../board-real/RealBoard';
import Game from '../scene/Game/Game';
import { Canvas } from '@react-three/fiber';

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
      {/* {!_.isEmpty(board) && (
        <div id="game">
          <Canvas
            flat
            linear
            camera={{
              position: [0, 15, 2.5]
            }}
          >
            <Game />
            {!playerReady && !_.isEmpty(otherPlayer) && (
              <mesh
                position={[-6, 0.3, 1]}
                scale={[3, 0.01, 3]}
                onClick={() => {
                  handleReadyClick();
                }}
              >
                <boxGeometry />
                <meshBasicMaterial transparent opacity={0.5} color={'red'} />
              </mesh>
            )}
            {playerReady && otherPlayer?.ready && (
              <RealBoard board={board} ws={ws} playerId={cookies.userId} yourTurn={yourTurn} />
            )}
          </Canvas>
        </div>
      )} */}
      {!_.isEmpty(board) && <TestBoard board={board} ws={ws} playerId={cookies.userId} yourTurn={yourTurn} />}
      <div className="container">
        <div className="messages-container">
          {_.isEmpty(otherPlayer) && <div>waiting for opponent to join</div>}
          {!_.isEmpty(otherPlayer) && playerReady && !otherPlayer.ready && <div>waiting for opponent to ready up</div>}
          <div>{yourName + '(You)'}</div>
          {otherPlayer && <div>{otherPlayer.name}</div>}
          {!playerReady && !_.isEmpty(otherPlayer) && <button onClick={handleReadyClick}>Ready</button>}
        </div>
        <div className="container">
          {/* {!_.isEmpty(board) && <Game board={board} ws={ws} playerId={cookies.userId} yourTurn={yourTurn} />} */}
          {!_.isEmpty(board) && <TestBoard board={board} ws={ws} playerId={cookies.userId} yourTurn={yourTurn} />}
        </div>
      </div>
    </>
  );
};

export default Room;
