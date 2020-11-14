import GameBoard from './GameBoard';

export default class Game {
    constructor(id, player0, player1) {
        this.id = id;
        this.player0 = player0;
        this.player1 = player1;

        this.gameBoard = new GameBoard();

        this.playerTurn = false;
    }

    getPlayerType(name) {
        if (this.player0 === name) return 0;
        if (this.player1 === name) return 1;

        return null;
    }

    toggleTurn() {
        this.playerTurn = !this.playerTurn;
    }
}
