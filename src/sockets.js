import socketio from 'socket.io';

class Socket {
    constructor(server) {
        this.io = socketio(server);
    }
}

export default Socket;
