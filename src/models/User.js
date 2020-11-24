const info = function (gameList) {
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
};

export default class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.gameId = null;
        this.gameInvites = [];

        this.info = info.bind(this);
    }

    isInGame() {
        return Boolean(this.gameId);
    }

    addInvite(name) {
        this.gameInvites.push(name);
    }

    removeInvite(name) {
        const index = this.gameInvites.findIndex(invite => invite === name);
        this.gameInvites.splice(index);
    }
}
