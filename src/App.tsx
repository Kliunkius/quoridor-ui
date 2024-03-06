import { useState } from 'react';

import useWebsocketClient from './hooks/useWebsocketClient';
import { MessageTypes } from './websockets/websocketTypes';

import Game from './components/scene/Game/Game';

function App() {
  const ws = useWebsocketClient();
  const [counter, setCounter] = useState(1);

  return (
    <>
      <button onClick={() => setCounter(counter + 1)}>{counter}</button>
      <br />
      <button onClick={() => ws.send('labutis')}>Send message</button>
      <br />
      <button onClick={() => ws.send(JSON.stringify({ type: MessageTypes.DEV_INFO }))}>DEV INFO</button>
      <br />
      <button onClick={() => ws.send(JSON.stringify({ type: MessageTypes.CHECK_STATUS }))}>STATUS</button>
      <Game />
    </>
  );
}

export default App;
