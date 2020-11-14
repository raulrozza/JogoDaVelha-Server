export default class LobbyController {
    run(socket, connection, startGame) {
        socket.on('invite', ({ inviterName, targetName }) => {
            connection.addInvite(inviterName, targetName);
            const target = connection.getUserByName(targetName);

            socket.sendMessage(target.id, 'newInvite', {
                inviterName,
            });
        });

        socket.on('refuseInvite', ({ name, inviterName }) => {
            connection.removeInvite(name, inviterName);
        });

        socket.on('acceptInvite', ({ name, inviterName }) => {
            const user = connection.getUserByName(name);

            if (user.isInGame())
                return socket.sendMessage(user.id, 'userAlreadyInGame');

            startGame([name, inviterName]);
        });
    }
}
