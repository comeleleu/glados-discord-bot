module.exports = {
    name: 'ping',
    description: 'Ping',
    usage: '',
    args: false,
    guildOnly: true,
    permissions: 'MANAGE_CHANNELS',

    execute() {

        return 'Pong';

    },
};