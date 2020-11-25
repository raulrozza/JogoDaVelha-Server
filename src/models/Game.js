import GameBoard from './GameBoard';

const Game = {
    create(id, player0, player1) {
        return {
            id: id,
            player0: player0,
            player1: player1,

            gameBoard: new GameBoard(),

            playerTurn: false,
        };
    },

    getPlayerType(game, name) {
        if (game.player0 === name) return 0;
        if (game.player1 === name) return 1;

        return null;
    },

    toggleTurn(game) {
        game.playerTurn = !game.playerTurn;
    },
};

export default Game;
