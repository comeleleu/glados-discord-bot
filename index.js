const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const commandFiles = require('./src/commands');

const client = new Discord.Client();
client.commands = new Discord.Collection();

Object.keys(commandFiles).map(key => {
    client.commands.set(prefix + commandFiles[key].name, commandFiles[key]);
});

client.login(token);

client.on('ready', () => {
    console.info(`Connected as ${client.user.tag}`);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${commandName} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }
    
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send(`There was an error trying to execute command ${commandName}...`);
    }

});