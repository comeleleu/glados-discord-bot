module.exports = {
    name: 'kick',
    description: 'Kick un user',
    execute(message, args) {
        console.log(args);

        if (message.mentions.users.size) {
            var taggedUser = message.mentions.users.first();
            message.reply('voulez-vous vraiment kick ' + taggedUser.username + ' ?');
        } else {
            message.reply('Le joueur ' + args[0] + ' est introuvable...');
        }

    },
};