module.exports = {
    name: 'ping',
    description: 'Check if GLaDOS is working',
    usage: '',
    args: false,
    guildOnly: true,
    delete: true,
    permissions: 'ADMINISTRATOR',

    execute(message, args, client, db) {

        message.author.send('Pong');

    },
};