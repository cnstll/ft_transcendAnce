import { io } from 'socket.io-client';

export const socket = io(`http://${process.env.REACT_APP_BACKEND_URL}`, {
  withCredentials: true,
});
export let socketID = '';
socket.on('connect', () => {
  socketID = socket.id;
});
