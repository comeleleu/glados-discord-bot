const Discord = require('discord.js');
// const random = require('random');
// const fs = require('fs');
// const jsonfile = require('jsonfile');
const config = require('./config.json');
const bot = new Discord.Client();
// const botCommands = require('./commands');
const roles = {
    yellow: '712726356386906162',
    pink: '712726390453174383',
    purple: '712726447122284594'
};

// bot.commands = new Discord.Collection();

// var stats = {};
// if (fs.existsSync('stats.json')) {
//     stats = jsonfile.readFileSync('stats.json')
// }

bot.on('ready', () => {
    console.log(`Connecté en tant que ${bot.user.tag}`);
});

bot.on('message', message => {
    if (message.author.id == bot.user.id)
        return;

    //PING
    if (message.content === '!ping') {
        message.reply('pong');
        return;
    }

    const parts = message.content.split(' ');

    // ROLES
    if (message.content.startsWith('!role')) {
        var roleName = parts[1];

        if (roleName in roles === true) {
            message.member.roles.add(roles[roleName]);
            message.reply('vous possédez désormais le rôle ' + roleName);
        }
        else {
            message.reply('le rôle ' + roleName + ' n\'est pas valide...')
        }
    }
    
    // KICK
    else if (message.content.startsWith('!kick')) {
        if (message.mentions.users.size) {
            const taggedUser = message.mentions.users.first();
            message.reply('voulez-vous vraiment kick ' + taggedUser.username + ' ?');
        } else {
            message.reply('Le joueur ' + parts[1] + ' est introuvable...');
        }
    }


    // STATS
    // if (message.guild.id in stats === false) {
    //     stats[message.guild.id] = {};
    // }

    // const guildStats = stats[message.guild.id]
    // if (message.author.id in guildStats === false) {
    //     guildStats[message.author.id] = {
    //         xp: 0,
    //         level: 0,
    //         last_message: 0
    //     };
    // }

    // const userStats = guildStats[message.author.id];
    // if (Date.now() - userStats.last_message > 60000) {
    //     userStats.xp += random.int(15, 25);
    //     userStats.last_message = Date.now();

    //     const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100
    //     if (userStats.xp >= xpToNextLevel) {
    //         userStats.level ++;
    //         userStats.xp -= xpToNextLevel;
    //         message.channel.send(message.author.username + ' à atteint le niveau ' + userStats.level)
    //     }

    //     jsonfile.writeFileSync('stats.json', stats)

    //     console.log(message.author.username + ' possède ' + userStats.xp + 'xp');
    //     console.log(xpToNextLevel + 'xp to next level');
    // }

});

bot.login(config.token);