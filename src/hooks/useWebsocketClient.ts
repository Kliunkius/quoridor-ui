import _ from 'lodash';
import { useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

import { Message, MessageTypes } from './websocketTypes';
import { Board } from '../components/board/types';

export const formatMessage = (type: MessageTypes, data: any) => {
  return JSON.stringify({ type, data });
};

const useWebsocketClient = (handleStateChange: (props: Board) => void) => {
  const wsRef = useRef<WebSocket>({} as WebSocket);
  if (!wsRef.current.binaryType) {
    wsRef.current = new WebSocket('ws://localhost:3005');
  }

  const [cookies, setCookie, removeCookie] = useCookies<string>(['userId']);
  const { roomCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const ws = wsRef.current;

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      ws.close();
    };
  }, [wsRef]);

  useEffect(() => {
    const ws = wsRef.current;

    ws.onopen = () => {
      console.log('WebSocket connected');
      if (_.isEmpty(cookies.userId)) {
        ws.send(formatMessage(MessageTypes.JOIN_ROOM, { roomCode }));
        return;
      }

      ws.send(formatMessage(MessageTypes.RECONNECT, { userId: cookies.userId }));
    };

    ws.onmessage = (event) => {
      const parsedMessage: Message = JSON.parse(event.data);
      const parsedData = parsedMessage.data;

      switch (parsedMessage.type) {
        case MessageTypes.JOIN_ROOM: {
          handleStateChange(parsedData.board);
          setCookie('userId', parsedData.userId);
          break;
        }
        case MessageTypes.RECONNECT: {
          handleStateChange(parsedData.board);
          break;
        }
        case MessageTypes.MOVE: {
          handleStateChange(parsedData.board);
          break;
        }
        case MessageTypes.ROOM_DELETED: {
          removeCookie('userId');
          navigate(`/`);
          break;
        }
        default: {
          console.log(`Sorry, the type ${parsedMessage.type} is not handled`);
        }
      }
    };
  }, [handleStateChange, navigate, roomCode, setCookie, cookies.userId, removeCookie]);

  return wsRef.current;
};

export default useWebsocketClient;
