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

// Cooldowns init
client.cooldowns = new Discord.Collection();

// Login 
client.login(config.token);
client.on('ready', () => {
    console.info(`Connected as ${client.user.tag}`);

    // Modules executions
    setInterval(function(){
        client.modules.get('rss').execute(client, db);
    }, 1000 * 60);

    // New message
    client.on('message', message => {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.split(/ +/);
        const commandName = args.shift().toLowerCase().substring(1);
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        // check message's origin
        if (command.guildOnly && message.channel.type !== 'text') {
            return message.author.send('I can\'t execute that command inside DMs...');
        }

        // check if the author have permission
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return message.author.send('You don\'t have permission to do this!');
            }
        }

        // check if needs help
        if (args[0] == '--help' || args[0] == '-h') {
            let reply = `${config.prefix}${commandName}: ${command.description}`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${config.prefix}${commandName} ${command.usage}\``;
            }
    
            message.author.send(reply);

            return message.channel.bulkDelete(1, true).catch(err => {
                message.author.send('There was an error trying to delete messages in this channel...');
            });
        }

        // check if the message contains arguments
        if (command.args && !args.length) {
            let reply = 'You didn\'t provide any arguments!';

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${config.prefix}${commandName} ${command.usage}\``;
            }

            return message.author.send(reply);
        }

        // cooldown
        if (commandName.cooldown !== 0) {
            const { cooldowns } = client;

            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Discord.Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = command.cooldown * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    message.author.send(`Please wait ${timeLeft.toFixed(0)} more second(s) before reusing the \`${config.prefix}${command.name}\` command.`);

                    return message.channel.bulkDelete(1, true).catch(err => {
                        message.author.send('There was an error trying to delete messages in this channel...');
                    });
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        
        // execute command
        try {

            command.execute(message, args, client, db);

            if (command.deleteMessage) {
                message.channel.bulkDelete(1, true).catch(err => {
                    message.author.send('There was an error trying to delete messages in this channel...');
                });
            }

        } catch (error) {
            console.error(error);
            message.author.send(`There was an error trying to execute command ${config.prefix}${commandName}...`);
        }

    });

    // Todo: add event on a new reaction

});