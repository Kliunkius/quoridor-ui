import _ from 'lodash';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { Message, MessageTypes } from './websocketTypes';

const useWebsocketClient = () => {
  const [ws, setWs] = useState<WebSocket>({} as WebSocket);
  const [cookies, setCookie] = useCookies<string>(['']);

  useEffect(() => {
    if (!_.isEmpty(ws)) {
      return;
    }

    const websocket = new WebSocket('ws://localhost:3005');

    websocket.onopen = () => {
      console.log('WebSocket connected');
      if (_.isEmpty(cookies.userId)) {
        websocket.send(JSON.stringify({ type: MessageTypes.CONNECT }));
      }
    };

    websocket.onmessage = (event) => {
      const parsedMessage: Message = JSON.parse(event.data);
      const parsedData = parsedMessage.data;

      switch (parsedMessage.type) {
        case MessageTypes.CONNECT: {
          setCookie('userId', parsedData.userId);
          break;
        }
        case MessageTypes.CHECK_STATUS: {
          console.log(parsedData);
          break;
        }
        case MessageTypes.DEV_INFO: {
          console.log(parsedData);
          break;
        }
        default: {
          console.log(`Sorry, the type ${parsedMessage.type} is not handled`);
        }
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(websocket);

    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      if (!_.isEmpty(ws)) {
        websocket.close();
      }
    };
  }, [ws, cookies.userId, setCookie]);

  return ws;
};

export default useWebsocketClient;
