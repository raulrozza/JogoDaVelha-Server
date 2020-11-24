export default function game(gameController) {
    const events = [
        {
            name: 'newMove',
            callback: ({ name, gameBoard }) => {
                const game = gameController.getActiveGame(name);

                game.gameBoard = gameBoard;
                game.toggleTurn();

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
            name: 'endGame',
            callback: ({ name, winner, gameBoard }) => {
                const game = gameController.getActiveGame(name);

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
