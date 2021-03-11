module.exports = {
    name: 'role',
    description: 'Attribute roles to users',
    usage: '@user @role',
    args: false,
    guildOnly: true,

    execute(message) {

        if (!message.mentions.roles.size) return'You need to tag role(s) in order to give them...';
        if (!message.mentions.users.size) return 'You need to tag user(s) in order to give them role(s)...';

        message.mentions.users.forEach(user => {
            message.mentions.roles.forEach(role => {
                message.guild.member(user).roles.add(role);
            });
        });

        let reply = 'User(s) ';

        message.mentions.users.forEach(user => {
            reply += `${user} `;
        });

        reply += `now have role(s)`

        message.mentions.roles.forEach(role => {
            reply += ` ${role}`
        });

        return reply;

    },
};