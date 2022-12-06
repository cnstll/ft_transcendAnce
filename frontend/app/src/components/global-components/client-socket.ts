// import { createContext } from 'react';
import { io } from 'socket.io-client';
import { domain } from './interface';

export const socket = io(`${domain}`, {
  withCredentials: true,
  parser: require("socket.io-msgpack-parser"),
});
