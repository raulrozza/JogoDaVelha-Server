export default function lobby(connection, startGame, socket) {
    const events = [
        {
            name: 'invite',
            callback: ({ inviterName, targetName }) => {
                console.log(
                    `${inviterName} has invited ${targetName} to a game.`,
                );

                connection.addInvite(inviterName, targetName);
                const target = connection.getUserByName(targetName);

                socket.sendMessage(target.id, 'newInvite', {
                    inviterName,
                });
            },
        },
        {
            name: 'refuseInvite',
            callback: ({ name, inviterName }) => {
                console.log(`${name} refused ${inviterName}'s invite.`);

                connection.removeInvite(name, inviterName);
            },
        },
        {
            name: 'acceptInvite',
            callback: ({ name, inviterName }) => {
                console.log(`${name} accepted ${inviterName}'s invite.`);

                const user = connection.getUserByName(name);

                if (user.isInGame())
                    return socket.sendMessage(user.id, 'userAlreadyInGame');

                startGame([name, inviterName]);
            },
        },
    ];

    return events;
}
