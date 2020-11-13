export default class User {
    constructor(id, name) {
        this.id = id || null;
        this.name = name;
        this.gameId = null;
        this.gameInvites = [];
    }

    info(gameList) {
        const userInfo = {
            inGame: false,
            gameInvites: this.gameInvites,
        };

        if (this.gameId) {
            const game = gameList.find(game => game.id === this.gameId);

            userInfo.inGame = true;
            userInfo.playerTurn = game.playerTurn;
            userInfo.gameBoard = game.gameBoard;
            userInfo.playerType = game.getPlayerType(this.name);
        }

        return userInfo;
    }
}
