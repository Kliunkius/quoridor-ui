import axios from 'axios';

const host = process.env.REACT_APP_API_HOST;

export const createRoom = async (roomCode: string) => {
  return axios.post(`${host}/create-room`, { roomCode });
};
