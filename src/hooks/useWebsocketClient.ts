import _ from 'lodash';
import { useEffect, useRef } from 'react';

import { Message, MessageTypes } from './websocketTypes';

export const formatMessage = (type: MessageTypes, data: any) => {
  return JSON.stringify({ type, data });
};

type StateChangeMap = Record<MessageTypes, (props: any) => void>;

const useWebsocketClient = (handleStateChangeMap: StateChangeMap, userId: string, roomCode: string) => {
  const wsRef = useRef<WebSocket>({} as WebSocket);
  if (!wsRef.current.binaryType) {
    wsRef.current = new WebSocket('ws://localhost:3005');
  }

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
      if (_.isEmpty(userId)) {
        ws.send(formatMessage(MessageTypes.JOIN_ROOM, { roomCode }));
        return;
      }

      ws.send(formatMessage(MessageTypes.RECONNECT, { userId }));
    };

    ws.onmessage = (event) => {
      const parsedMessage: Message = JSON.parse(event.data);
      const parsedData = parsedMessage.data;

      const stateChangeFunction = handleStateChangeMap[parsedMessage.type];
      stateChangeFunction(parsedData);
    };
  }, [handleStateChangeMap, roomCode, userId]);

  return wsRef.current;
};

export default useWebsocketClient;
