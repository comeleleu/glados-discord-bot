const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const botCommands = require('./src/commands');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

Object.keys(botCommands).map(key => {
    bot.commands.set(prefix + botCommands[key].name, botCommands[key]);
});
console.log(bot.commands);

bot.login(token);

bot.on('ready', () => {
    console.log(`Connecté en tant que ${bot.user.tag}`);
});

bot.on('message', message => {
    if (/*!message.content.startsWith(prefix) ||*/ message.author.bot) return;
    
    const args = message.content.split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (!bot.commands.has(command)) return;
    
    try {
        bot.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Erreur lors de l\'exécution de la commande ' + command);
    }

});