module.exports = {
    name: 'ping',
    aliases: [],
    description: 'Check if GLaDOS is working',
    usage: '',
    args: false,
    guildOnly: true,
    deleteMessage: true,
    hiddenCommand: true,
    permissions: 'ADMINISTRATOR',
    cooldown: 10,

    execute(client, message, args) {

        message.author.send('Pong');

    },
};