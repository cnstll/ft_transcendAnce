import { io } from 'socket.io-client';
import { domain } from './interface';

export const socket = io(`${domain}`, {
  withCredentials: true,
});
export let socketID = '';
socket.on('connect', () => {
  socketID = socket.id;
});
