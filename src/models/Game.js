import GameBoard from './GameBoard';

export default class Game {
    constructor(id, player0, player1) {
        this.id = id;
        this.player0 = player0;
        this.player1 = player1;

        this.gameBoard = new GameBoard();

        this.playerTurn = 0;
    }
}
