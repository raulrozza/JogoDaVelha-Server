import socketio from 'socket.io';

export default class Socket {
    constructor(server) {
        this.io = socketio(server, {
            cors: {
                origin: '*',
            },
        });
    }

    emit(...args) {
        this.io.emit(...args);
    }

    on(...args) {
        this.io.on(...args);
    }

    sendMessage(to, message, data) {
        this.io.to(to).emit(message, data);
    }
}
