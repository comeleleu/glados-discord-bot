module.exports = {
    name: 'ping',
    description: 'Test if the bot is working and can respond',
    usage: '',
    args: false,
    cooldown: 5,
    execute(message) {

        message.channel.send('Pong');

    },
};