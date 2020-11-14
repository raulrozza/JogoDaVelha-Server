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
        this.connection.run(this.socket, this.runningGames);
        this.lobby.run(this.socket, this.connection, this.startGame);

        this.socket.on('newMove', this.newMove);
        this.socket.on('endgame', this.endGame);
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

        this.socket.sendMessage(user.id, 'user', user.info(this.runningGames));
    }

    newMove({ name, gameBoard }) {
        const game = this.getActiveGame(name);

        game.gameBoard = gameBoard;
        game.toggleTurn();

        this.updateGame(game);

        const newGameState = {
            playerTurn: game.playerTurn,
            gameBoard: game.gameBoard,
        };

        this.sendNewMove(game.player0, newGameState);
        this.sendNewMove(game.player1, newGameState);
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

    endGame({ name, winner, gameBoard }) {
        const game = this.getActiveGame(name);

        this.removeGame(game);

        const endgameData = {
            winner,
            gameBoard,
        };

        this.notifyEndGame(game.player0, endgameData);
        this.notifyEndGame(game.player1, endgameData);
    }

    removeGame(game) {
        const index = this.getGameIndexById(game.id);

        this.runningGames.splice(index);
    }

    notifyEndGame(playerName, data) {
        const user = this.connection.getUserByName(playerName);

        this.socket.sendMessage(user.id, 'endgame', {
            ...data,
            user: user.info(this.runningGames),
        });
    }
}
