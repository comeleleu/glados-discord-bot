const Discord = require('discord.js');
const random = require('random');
const fs = require('fs');
const jsonfile = require('jsonfile');

const bot = new Discord.Client();
const roles = {
    yellow: '712726356386906162',
    pink: '712726390453174383',
    purple: '712726447122284594'
};

// var stats = {};
// if (fs.existsSync('stats.json')) {
//     stats = jsonfile.readFileSync('stats.json')
// }

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('reaction', reaction => {
    console.log(reaction);
    reaction.message.channel.send(`The emoji used was: ${reaction.emoji}`);
});

bot.on('message', message => {
    if (message.author.id == bot.user.id)
        return;

    console.log(message.reactions);

    //PING
    if (message.content === 'ping') {
        message.reply('pong');
    }

    // ROLES
    const parts = message.content.split(' ');
    if (parts[0] === '!role') {
        var roleName = parts[1];

        if (roleName in roles === true) {
            message.member.roles.add(roles[roleName]);
            message.reply('vous avez désormais le rôle ' + roleName);
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

bot.login('NzEyNzE3MjQwNTcwNDc4NjQ2.XsVo-g.w5ALB01suu-LVVtkiMBQ36ftwhE');

