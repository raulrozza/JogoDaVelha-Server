import { User } from '../models';

export default class ConnectionController {
    constructor() {
        this.connectedUsers = [];
    }

    run(socket) {
        socket.on('connection', emitter => {
            const existingUser = this.userExists(emitter.name);

            let myUser;

            if (existingUser)
                myUser = this.updateUserId(emitter.name, emitter.id);
            else myUser = this.addUser(emitter.id, emitter.name);

            const userInfo = myUser.info(this.runningGames);

            socket.sendMessage(emitter.id, 'user', userInfo);
        });

        socket.on('userlist', callback => {
            const onlineUsers = this.connectedUsers.map(user => ({
                id: user.id,
                name: user.name,
            }));

            callback(onlineUsers);
        });

        socket.on('logout', emitter => {
            const index = this.getUserIndexById(emitter);

            this.connectedUsers.splice(index);
        });
    }

    userExists(name) {
        const userIndex = this.getIndexIndexByName(name);

        return Boolean(userIndex);
    }

    updateUserId(name, newId) {
        const userIndex = this.getUserIndexByName(name);

        const user = this.connectedUsers[userIndex];

        user.id = newId;

        this.connectedUsers[userIndex] = user;
    }

    addUser(id, name) {
        const newUser = new User(id, name);

        this.connectedUsers.push(newUser);

        return newUser;
    }

    getUserIndexByName(name) {
        const userIndex = this.connectedUsers.findIndex(
            connectedUser => connectedUser.name === name,
        );

        return userIndex;
    }

    getUserIndexById(id) {
        const userIndex = this.connectedUsers.findIndex(
            connectedUser => connectedUser.id === id,
        );

        return userIndex;
    }

    updateUserById(id, user) {
        const userIndex = this.getUserIndexById(id);

        this.connectedUsers[userIndex] = user;
    }

    addInvite(targetName, inviterId) {
        const inviterName = this.getUserNameById(inviterId);
        const targetIndex = this.getUserIndexByName(targetName);

        const target = this.connectedUsers[targetIndex];

        target.gameInvites.push(inviterName);

        return target.id;
    }

    getUserNameById(id) {
        const userIndex = this.getUserIndexById(id);

        return this.connectedUsers[userIndex].name;
    }

    removeInvite(userId, inviterId) {
        const inviterName = this.getUserNameById(inviterId);

        const user = this.getUserById(userId);

        const inviteIndex = user.gameInvites.findIndex(
            invite => invite === inviterName,
        );
        user.gameInvites.splice(inviteIndex);
    }

    getUserById(id) {
        const userIndex = this.getUserIndexById(id);
        const user = this.connectedUsers[userIndex];

        return user;
    }

    getUserByName(name) {
        const userIndex = this.getUserIndexByName(name);

        return this.connectedUsers[userIndex];
    }
}
