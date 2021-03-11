// Discord
const Discord = require('discord.js');
const client = new Discord.Client();

// Config
const fs = require('fs');
let configFile = fs.readFileSync('config.json');
let config = JSON.parse(configFile);

// Database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ config: [], rss: [] }).write();

// Commands init
const commandsFile = require('./src/commands');
client.commands = new Discord.Collection();
Object.keys(commandsFile).map(key => {
    client.commands.set(commandsFile[key].name, commandsFile[key]);
});

// Modules init
const modulesFile = require('./src/modules');
client.modules = new Discord.Collection();
Object.keys(modulesFile).map(key => {
    client.modules.set(modulesFile[key].name, modulesFile[key]);
});

// Login 
client.login(config.token);
client.on('ready', () => {
    console.info(`Connected as ${client.user.tag}`);
});

// Modules executions
// setInterval(function(){
//     client.modules.get('rss').execute(client, db);
// }, 1000 * 60);

// New message
client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.split(/ +/);
    const commandName = args.shift().toLowerCase().substring(1);
    
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    // check message's origin
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs...');
    }

    // check if the author have permission
    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.reply('You don\'t have permission to do this!');
        }
    }

    // check if the message contains arguments
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${config.prefix}${commandName} ${command.usage}\``;
        }

        // return message.author.send(reply);
        return message.reply(reply);
    }
    
    // execute command
    try {

        reply = command.execute(message, args, client, db);

        // message.channel.bulkDelete(1, true);

        if (typeof reply !== 'undefined') {
            // message.author.send(reply);
            message.reply(reply);

        }

    } catch (error) {
        console.error(error);
        // message.author.send(`There was an error trying to execute command ${commandName}...`);
        message.reply(`There was an error trying to execute command ${commandName}...`);
    }

});

// New reaction