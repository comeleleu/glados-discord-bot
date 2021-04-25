module.exports = {
    name: 'help',
    aliases: ['h', 'cmd', 'command', 'commands'],
    description: 'List of all available commands',
    usage: '',
    args: false,
    guildOnly: true,
    deleteMessage: true,
    hiddenCommand: false,
    permissions: 'ADMINISTRATOR',
    cooldown: 30,

    execute(message, args, client, db) {

        let reply = `GLaDOS Discord bot available commands:`;

        client.commands.forEach(command => {
            if (!command.hiddenCommand) {
                reply += `\n  - ${command.name}: ${command.description}`;
            }
        });

        message.author.send(reply);

    },
};