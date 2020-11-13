import express from 'express';
import http from 'http';
import Socket from './sockets';

const app = express();
const server = http.Server(app);

const socketServer = new Socket(server);

export default server;
