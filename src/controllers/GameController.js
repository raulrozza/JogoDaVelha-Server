import { Game } from '../models';
import ConnectionController from './ConnectionController';
import LobbyController from './LobbyController';

export default class GameController {
    constructor(socketServer) {
        this.runningGames = [];

        this.connection = new ConnectionController();
        this.lobby = new LobbyController();

        this.socket = socketServer;
    }

    run() {
        this.connection.run(this.socket);
        this.lobby.run(this.socket, this.connection, this.startGame);
    }

    startGame(players) {
        const [player0, player1] = this.getPlayerOrder(players);

        const game = this.createNewGame(player0, player1);

        this.setPlayersGame(game.id, [player0, player1]);

        this.sendUserInfo(player0);
        this.sendUserInfo(player1);
    }

    getPlayerOrder(players) {
        const randomNumber = Math.random();
        const reverse = Boolean(Math.round(randomNumber));

        if (reverse) return players.reverse();

        return players;
    }

    createNewGame(player0, player1) {
        const newGameId = this.runningGames.length + 1;

        const game = new Game(newGameId, player0, player1);
        this.runningGames.push(game);

        return game;
    }

    setPlayersGame(id, players) {
        players.forEach(playerId => {
            const user = this.connection.getUserById(playerId);

            this.connection.updateUserById(playerId, {
                ...user,
                gameId: id,
            });
        });
    }

    sendUserInfo(id) {
        const user = this.connection.getUserById(id);

        this.socket.sendMessage(id, 'user', user.info(this.runningGames));
    }
}
