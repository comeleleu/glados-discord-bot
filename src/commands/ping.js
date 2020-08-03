module.exports = {
    name: 'ping',
    description: 'Test if the bot is working and can respond',
    usage: '',
    args: false,
    guildOnly: false,
    cooldown: 10,
    execute(message) {

        message.channel.send('Pong');

    },
};