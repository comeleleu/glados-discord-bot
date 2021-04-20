module.exports = {
    name: 'commands',
    description: 'List of all available commands',
    usage: '',
    args: false,
    guildOnly: true,
    delete: true,
    permissions: 'ADMINISTRATOR',

    execute(message, args, client, db) {

        let reply = `GLaDOS Discord bot available commands:`;

        client.commands.forEach(command => {
            reply += `\n  - ${command.name}: ${command.description}`;
        });

        message.author.send(reply);

    },
};