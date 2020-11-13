export default class LobbyController {
    run(socket, connection, startGame) {
        socket.on('invite', emitter => {
            const targetId = connection.addInvite(
                emitter.targetName,
                emitter.inviterId,
            );

            socket.sendMessage(targetId, 'newInvite', {
                inviterId: emitter.inviterId,
            });
        });

        socket.on('refuseInvite', ({ id, inviterId }) => {
            connection.removeInvite(id, inviterId);
        });

        socket.on('acceptInvite', ({ id, inviterId }) => {
            const user = connection.getUserById(id);

            if (user.isInGame())
                return socket.sendMessage(id, 'userAlreadyInGame');

            startGame([id, inviterId]);
        });
    }
}
