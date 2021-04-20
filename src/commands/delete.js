module.exports = {
    name: 'delete',
    description: 'Delete up to 99 messages on a channel',
    usage: '<count>',
    args: true,
    guildOnly: true,
    delete: false,
    permissions: 'MANAGE_MESSAGES',

    execute(message, args, client, db) {

        let amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            message.author.send('That doesn\'t seem to be a valid number');
        } else if (amount <= 1 || amount > 100) {
            message.author.send('You need to input a number between 1 and 99');
        }

        message.channel.bulkDelete(amount, true).catch(err => {
            message.author.send('There was an error trying to delete messages in this channel...');
        });

    },
};