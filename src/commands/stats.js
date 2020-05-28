// const random = require('random');
// const fs = require('fs');
// const jsonfile = require('jsonfile');

// bot.commands = new Discord.Collection();

// var stats = {};
// if (fs.existsSync('stats.json')) {
//     stats = jsonfile.readFileSync('stats.json')
// }

bot.on('message', message => {
   


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