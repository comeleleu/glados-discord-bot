module.exports = {
    name: 'kick',
    description: 'Kick a user from the server',
    usage: '@user',
    args: false,
    guildOnly: true,
    cooldown: 0,
    execute(message) {

        if (!message.mentions.users.size) return message.channel.send('You need to tag a user in order to kick them...');

        const taggedUser = message.mentions.users.first();
        
        message.channel.send(`You wanted to kick ${taggedUser.username}`);

    },
};