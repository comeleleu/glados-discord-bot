module.exports = {
	name: 'info',
    description: 'Various informations about the server',
    usage: '<args|avatar|roles|server|user>',
    args: true,
    guildOnly: true,
    cooldown: 60,
	execute(message, args) {

        switch (args[0]) {
            case 'args':
                message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
                break;

            case 'avatar':
                if (!message.mentions.users.size) {
                    return message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
                }
        
                const avatarList = message.mentions.users.map(user => {
                    return `${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`;
                });
        
                message.channel.send(avatarList);
                break;

            case 'roles':
                console.log(message.guild.roles);
                break;
            
            case 'server':
                message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
                break;

            case 'user':
                message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
                break;
        }
	},
};