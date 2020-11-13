export default class User {
    constructor(id, name) {
        this.id = id || null;
        this.name = name;
        this.gameId = null;
        this.gameInvites = [];
    }

    info(gameList) {
        const userInfo = {
            inGame: this.isInGame(),
            gameInvites: this.gameInvites,
        };

        if (this.gameId) {
            const game = gameList.find(game => game.id === this.gameId);

            userInfo.playerTurn = game.playerTurn;
            userInfo.gameBoard = game.gameBoard;
            userInfo.playerType = game.getPlayerType(this.name);
        }

        return userInfo;
    }

    isInGame() {
        return Boolean(this.gameId);
    }
}
