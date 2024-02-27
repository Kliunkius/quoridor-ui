import React, { useState, useEffect } from 'react';

const Client = () => {
  const [socket, setSocket] = useState<WebSocket>({} as WebSocket);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3005');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return <button onClick={() => socket.send('hey ho csgo')}>Send message</button>;
};

export default Client;
