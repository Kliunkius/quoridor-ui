import _ from 'lodash';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { Message, MessageTypes } from './websocketTypes';

export const formatMessage = (type: MessageTypes, data: any) => {
  return JSON.stringify({ type, data });
};

const useWebsocketClient = (roomCode: string, handleStateChange: (props: any) => void) => {
  const [ws, setWs] = useState<WebSocket>({} as WebSocket);
  const [cookies, setCookie, removeCookie] = useCookies<string>(['']);

  useEffect(() => {
    if (!_.isEmpty(ws)) {
      return;
    }

    const websocket = new WebSocket('ws://localhost:3005');

    websocket.onopen = () => {
      console.log('WebSocket connected');
      if (_.isEmpty(cookies.userId)) {
        websocket.send(formatMessage(MessageTypes.JOIN_ROOM, { roomCode }));
      }
    };

    websocket.onmessage = (event) => {
      const parsedMessage: Message = JSON.parse(event.data);
      const parsedData = parsedMessage.data;

      switch (parsedMessage.type) {
        case MessageTypes.JOIN_ROOM: {
          console.log('parsedData JOIN_ROOM', parsedData);
          handleStateChange(parsedData.board);
          setCookie('userId', parsedData.userId);
          break;
        }
        case MessageTypes.MOVE: {
          console.log('parsedData MOVE', parsedData);
          handleStateChange(parsedData.board);
          break;
        }
        default: {
          console.log(`Sorry, the type ${parsedMessage.type} is not handled`);
        }
      }
    };

    websocket.onclose = () => {
      removeCookie('userId');
      console.log('WebSocket disconnected');
    };

    setWs(websocket);

    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      if (!_.isEmpty(ws)) {
        websocket.close();
      }
    };
  }, [roomCode, ws, handleStateChange, cookies.userId]);

  return ws;
};

export default useWebsocketClient;
