import { User } from '../models';

export default class ConnectionController {
    constructor() {
        this.connectedUsers = [];
    }

    run(socket, runningGames, updatePlayerIdOnGame) {
        socket.on('connection', emitter => {
            emitter.on('register', ({ name }) => {
                const existingUser = this.userExists(name);

                let myUser;

                if (existingUser) {
                    const oldUser = this.getUserByName(name);

                    myUser = this.updateUserId(name, emitter.id);

                    if (oldUser.isInGame())
                        updatePlayerIdOnGame(
                            oldUser.id,
                            myUser.id,
                            myUser.gameId,
                        );
                } else myUser = this.addUser(emitter.id, name);

                const userInfo = myUser.info(runningGames);

                socket.sendMessage(emitter.id, 'user', userInfo);

                this.sendUserList(socket);
            });

            emitter.on('disconnect', () => {
                const user = this.getUserById(emitter.id);

                if (user.isInGame()) this.updateUserId(user.name, null);
                else this.removeUser(user.name);

                this.sendUserList(socket);
            });
        });

        socket.on('logout', name => {
            const index = this.getUserIndexByName(name);

            this.connectedUsers.splice(index);
        });
    }

    userExists(name) {
        const index = this.getUserIndexByName(name);

        return Boolean(index);
    }

    getUserIndexByName(name) {
        const index = this.connectedUsers.findIndex(
            connectedUser => connectedUser.name === name,
        );

        return index;
    }

    getUserByName(name) {
        const userIndex = this.getUserIndexByName(name);

        return this.connectedUsers[userIndex];
    }

    updateUserId(name, newId) {
        const index = this.getUserIndexByName(name);

        const user = this.connectedUsers[index];

        user.id = newId;

        this.connectedUsers[index] = user;
    }

    addUser(id, name) {
        const user = new User(id, name);

        this.connectedUsers.push(user);

        return user;
    }

    sendUserList(socket) {
        const onlineUsers = this.connectedUsers.map(user => ({
            id: user.id,
            name: user.name,
        }));

        socket.emit('userlist', onlineUsers);
    }

    getUserById(id) {
        const index = this.getUserIndexById(id);
        const user = this.connectedUsers[index];

        return user;
    }

    getUserIndexById(id) {
        const index = this.connectedUsers.findIndex(
            connectedUser => connectedUser.id === id,
        );

        return index;
    }

    updateUserById(id, user) {
        const index = this.getUserIndexById(id);

        this.connectedUsers[index] = user;
    }

    removeUser(name) {
        const index = this.getUserIndexById(name);

        this.connectedUsers.splice(index);
    }

    addInvite(targetName, inviterId) {
        const inviterName = this.getUserNameById(inviterId);
        const targetIndex = this.getUserIndexByName(targetName);

        const target = this.connectedUsers[targetIndex];

        target.gameInvites.push(inviterName);

        return target.id;
    }

    getUserNameById(id) {
        const index = this.getUserIndexById(id);

        return this.connectedUsers[index].name;
    }

    removeInvite(userId, inviterId) {
        const inviterName = this.getUserNameById(inviterId);

        const user = this.getUserById(userId);

        const inviteIndex = user.gameInvites.findIndex(
            invite => invite === inviterName,
        );
        user.gameInvites.splice(inviteIndex);
    }
}
