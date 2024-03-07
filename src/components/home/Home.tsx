import _ from 'lodash';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Home.css';
import { createRoom } from '../../api';

const Home = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoinGame = () => {
    navigate(`/${roomCode}`);
  };

  const handleCreateGame = async () => {
    if (_.isEmpty(roomCode)) {
      return;
    }

    await createRoom(roomCode);
    navigate(`/${roomCode}`);
  };

  const handleInputChange = (event: any) => {
    setRoomCode(event.target.value);
  };

  return (
    <div className="game-container">
      <input
        type="text"
        placeholder="Enter room code"
        value={roomCode}
        onChange={handleInputChange}
        className="textbox"
      />
      <div className="button-container">
        <button onClick={handleJoinGame}>Join Game</button>
        <button onClick={handleCreateGame}>Create Game</button>
      </div>
    </div>
  );
};

export default Home;
