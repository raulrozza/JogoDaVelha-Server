import { Game } from '../models';

export default function game(gameController) {
    const events = [
        {
            name: 'newMove',
            callback: ({ name, gameBoard }) => {
                const game = gameController.getActiveGame(name);

                console.log(game);

                game.gameBoard = gameBoard;
                Game.toggleTurn(game);

                gameController.updateGame(game);

                const newGameState = {
                    playerTurn: game.playerTurn,
                    gameBoard: game.gameBoard,
                };

                gameController.sendNewMove(game.player0, newGameState);
                gameController.sendNewMove(game.player1, newGameState);
            },
        },
        {
            name: 'endgame',
            callback: ({ name, winner, gameBoard }) => {
                const game = gameController.getActiveGame(name);

                console.log(`Game ended! ${name} won.`);

                gameController.removeGame(game);

                const endgameData = {
                    winner,
                    gameBoard,
                };

                gameController.notifyEndGame(game.player0, endgameData);
                gameController.notifyEndGame(game.player1, endgameData);
            },
        },
    ];

    return events;
}
