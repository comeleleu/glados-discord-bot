module.exports = {
    name: 'role',
    description: 'Obtenir les rôles donnés en argument',
    execute(message, args) {

        var roles = {
            yellow: '712726356386906162',
            pink: '712726390453174383',
            purple: '712726447122284594'
        };
        
        args.forEach(roleName => {
            if (roleName in roles === true) {
                message.member.roles.add(roles[roleName]);
                message.reply('vous possédez désormais le rôle ' + roleName);
            }
            else {
                message.reply('le rôle ' + roleName + ' n\'est pas valide...')
            }
        });

    },
};