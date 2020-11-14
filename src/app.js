import express from 'express';
import http from 'http';
import { GameController } from './controllers';
import { Socket } from './models';

const app = express();
const server = http.Server(app);

const socketServer = new Socket(server);

const game = new GameController(socketServer);
game.run();

export default server;
