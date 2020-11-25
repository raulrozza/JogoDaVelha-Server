import { User } from '../models';

export default class ConnectionController {
    constructor() {
        this.connectedUsers = [];
    }

    run(socket, runningGames, appendEvents) {
        socket.on('connection', emitter => {
            console.log(
                `New user connected with id ${emitter.id}. Total of ${Number(
                    this.connectedUsers.length,
                )} registered users connected.`,
            );

            this.sendUserList(socket);

            emitter.on('register', ({ name }) => {
                console.log(`Registering new user: ${name}.`);

                const existingUser = this.userExists(name);

                let myUser;

                if (existingUser) {
                    myUser = this.updateUserId(name, emitter.id);

                    console.log(`User reconnecting: ${name}.`);
                } else {
                    myUser = this.addUser(emitter.id, name);

                    console.log(`Registering new user: ${name}.`);
                }

                const userInfo = User.info(myUser, runningGames);

                socket.sendMessage(emitter.id, 'user', userInfo);

                this.sendUserList(socket);
            });

            emitter.on('disconnect', () => {
                const user = this.getUserById(emitter.id);

                if (!user) return;

                if (User.isInGame(user)) this.updateUserId(user.name, null);
                else this.removeUser(user.name);

                this.sendUserList(socket);
            });

            emitter.on('logout', name => {
                const index = this.getUserIndexByName(name);

                this.connectedUsers.splice(index);
            });

            appendEvents.forEach(event => {
                emitter.on(event.name, event.callback);
            });
        });
    }

    userExists(name) {
        const index = this.getUserIndexByName(name);

        return !(index < 0);
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

        return user;
    }

    addUser(id, name) {
        const user = User.create(id, name);

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

    addInvite(inviterName, targetName) {
        const target = this.getUserByName(targetName);

        User.addInvite(target, inviterName);

        return target.id;
    }

    removeInvite(name, inviterName) {
        const user = this.getUserByName(name);

        User.removeInvite(user, inviterName);
    }
}
