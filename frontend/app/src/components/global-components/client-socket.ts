import { io } from 'socket.io-client';
import { apiUrl } from './interface';

export const socket = io(`${apiUrl}`, {
  withCredentials: true,
});
export let socketID = '';
socket.on('connect', () => {
  socketID = socket.id;
});
