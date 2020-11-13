import { User } from '../models';

export default class GameController {
    constructor(socketServer) {
        this.connectedUsers = [];
        this.runningGames = [];

        this.socket = socketServer;
    }

    run() {
        this.socket.on('connection', socket => {
            const existingUser = this.getExistingUser(socket.name);

            let myUser;

            if (existingUser)
                myUser = this.updateExistingUser(socket.name, socket.id);
            else myUser = this.addUser(socket.id, socket.name);

            const userInfo = myUser.info(this.runningGames);

            this.socket.sendMessage(socket.id, 'user', userInfo);
        });

        this.socket.on('userlist', callback => {
            const onlineUsers = this.connectedUsers.map(user => ({
                id: user.id,
                name: user.name,
            }));

            callback(onlineUsers);
        });

        this.socket.on('logout', socket => {
            const index = this.getUserIndexById(socket);

            this.connectedUsers.splice(index);
        });
    }

    getExistingUser(name) {
        const user = this.connectedUsers.find(
            connectedUser => connectedUser.name === name,
        );

        return Boolean(user);
    }

    updateExistingUser(name, newId) {
        const userIndex = this.getUserIndexByName(name);

        userIndex.id = newId;

        this.connectedUsers[userIndex] = userIndex;
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

    addUser(id, name) {
        const newUser = new User(id, name);

        this.connectedUsers.push(newUser);

        return newUser;
    }
}
