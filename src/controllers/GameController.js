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
        this.connection.run(
            this.socket,
            this.runningGames,
            this.updatePlayerIdInGame,
        );
        this.lobby.run(this.socket, this.connection, this.startGame);

        this.socket.on('newMove', this.newMove);
        this.socket.on('endgame', this.endGame);
    }

    updatePlayerIdInGame(actualId, newId, gameId) {
        const gameIndex = this.getGameIndexById(gameId);

        const game = this.runningGames[gameIndex];

        this.runningGames[gameIndex] = game;
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

    newMove(emitter) {
        const game = this.getActiveGame(emitter.id);

        game.gameBoard = emitter.gameBoard;
        game.toggleTurn();

        this.updateGame(game);

        const newGameState = {
            playerTurn: game.playerTurn,
            gameBoard: game.gameBoard,
        };

        this.socket.sendMessage(game.player0, 'newMove', newGameState);
        this.socket.sendMessage(game.player1, 'newMove', newGameState);
    }

    getActiveGame(playerId) {
        const game = this.runningGames.find(
            game => game.player0 === playerId || game.player1 === playerId,
        );

        return game;
    }

    updateGame(game) {
        const gameIndex = this.getGameIndexById(game.id);

        this.runningGames[gameIndex] = game;
    }

    getGameIndexById(id) {
        const gameIndex = this.runningGames.find(game => game.id === id);

        return gameIndex;
    }

    endGame(emitter) {
        const game = this.getActiveGame(emitter.id);

        this.removeGame(game);

        const user0 = this.connection.getUserById(game.player0);
        this.socket.sendMessage(game.player0, 'endgame', {
            winner: emitter.winner,
            gameBoard: emitter.gameBoard,
            user: user0.info(this.runningGames),
        });

        const user1 = this.connection.getUserById(game.player1);
        this.socket.sendMessage(game.player0, 'endgame', {
            winner: emitter.winner,
            gameBoard: emitter.gameBoard,
            user: user1.info(this.runningGames),
        });
    }

    removeGame(game) {
        const gameIndex = this.getGameIndexById(game.id);

        this.runningGames.splice(gameIndex);
    }
}
