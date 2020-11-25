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

            userInfo.playerTurn = game.playerTurn;
            userInfo.gameBoard = game.gameBoard;
            userInfo.playerType = game.getPlayerType(user.name);
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
