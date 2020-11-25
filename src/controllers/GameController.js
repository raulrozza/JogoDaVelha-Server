import { game, lobby } from '../factories';
import { Game, User } from '../models';
import { ConnectionController } from './';

export default class GameController {
    constructor(socketServer) {
        this.runningGames = [];
        this.connection = new ConnectionController();

        this.socket = socketServer;
    }

    run() {
        const lobbyEvents = lobby(
            this.connection,
            this.startGame.bind(this),
            this.socket,
        );
        const gameEvents = game(this);

        this.connection.run(this.socket, this.runningGames, [
            ...lobbyEvents,
            ...gameEvents,
        ]);
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
        players.forEach(playerName => {
            const user = this.connection.getUserByName(playerName);

            this.connection.updateUserById(user.id, {
                ...user,
                gameId: id,
            });
        });
    }

    sendUserInfo(name) {
        const user = this.connection.getUserByName(name);

        this.socket.sendMessage(
            user.id,
            'user',
            User.info(user, this.runningGames),
        );
    }

    getActiveGame(playerName) {
        const game = this.runningGames.find(
            game => game.player0 === playerName || game.player1 === playerName,
        );

        return game;
    }

    updateGame(game) {
        const index = this.getGameIndexById(game.id);

        this.runningGames[index] = game;
    }

    getGameIndexById(id) {
        const index = this.runningGames.find(game => game.id === id);

        return index;
    }

    sendNewMove(playerName, data) {
        const user = this.connection.getUserByName(playerName);

        this.socket.sendMessage(user.id, 'newMove', data);
    }

    removeGame(game) {
        const index = this.getGameIndexById(game.id);

        this.runningGames.splice(index);
    }

    notifyEndGame(playerName, data) {
        const user = this.connection.getUserByName(playerName);

        this.socket.sendMessage(user.id, 'endgame', {
            ...data,
            user: User.info(user, this.runningGames),
        });
    }
}
