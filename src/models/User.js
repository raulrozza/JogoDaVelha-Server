import Game from './Game';

const User = {
    create(id, name) {
        return {
            id,
            name,
            gameId: null,
            gameInvites: [],
        };
    },

    info(user, gameList) {
        const userInfo = {
            inGame: User.isInGame(user),
            gameInvites: user.gameInvites,
        };

        if (user.gameId) {
            const game = gameList.find(game => game.id === user.gameId);

            if (game) {
                userInfo.playerTurn = game.playerTurn;
                userInfo.gameBoard = game.gameBoard;
                userInfo.playerType = Game.getPlayerType(game, user.name);
            } else {
                user.gameId = null;

                userInfo.inGame = User.isInGame(user);
            }
        }

        return userInfo;
    },

    isInGame(user) {
        return Boolean(user.gameId);
    },

    addInvite(user, name) {
        user.gameInvites.push(name);
    },

    removeInvite(user, name) {
        const index = user.gameInvites.findIndex(invite => invite === name);
        user.gameInvites.splice(index);
    },
};

export default User;
