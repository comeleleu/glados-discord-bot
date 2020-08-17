const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const commandFiles = require('./src/commands');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

//init des commandes
Object.keys(commandFiles).map(key => {
    client.commands.set(prefix + commandFiles[key].name, commandFiles[key]);
});

//login
client.login(token);

//client ready
client.on('ready', () => {
    console.info(`Connected as ${client.user.tag}`);
});

//on new message
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    //args
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${commandName} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    //dm
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    //cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    
    //exec cmd
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.channel.send(`There was an error trying to execute command ${commandName}...`);
    }

});