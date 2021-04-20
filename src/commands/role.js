module.exports = {
    name: 'role',
    description: 'Attribute roles to users',
    usage: '@user @role',
    args: true,
    guildOnly: true,
    delete: true,
    permissions: 'MANAGE_ROLES',

    execute(message, args, client, db) {

        if (!message.mentions.roles.size) {
            message.author.send('You need to tag role(s) in order to give them...');
        }
        if (!message.mentions.users.size) {
            message.author.send('You need to tag user(s) in order to give them role(s)...');
        }

        let messageComplete = false;
        let reply = 'User(s)';
        let replyRoles = 'now have role(s)';

        message.mentions.users.forEach(user => {
            let messageRoles = 'You now have role(s)';

            reply += `${user} `;

            message.mentions.roles.forEach(role => {
                let roleName = role.name.split(" ").join("");

                message.guild.member(user).roles.add(role);
                
                if (!messageComplete) {
                    replyRoles += ` @${roleName}`;
                }
                messageRoles += ` @${roleName}`;
            });

            if (!messageComplete) {
                messageComplete = true;
            }

            user.send(messageRoles + ` on ${message.guild.name}`);
        });

        message.author.send(reply + replyRoles);

    },
};