module.exports = {
    name: 'delete',
    description: 'Delete up to 99 messages',
    usage: '<count>',
    args: true,
    guildOnly: true,
    permissions: 'MANAGE_MESSAGES',

    execute(message, args) {

        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return 'That doesn\'t seem to be a valid number';
        } else if (amount <= 1 || amount > 100) {
            return 'You need to input a number between 1 and 99';
        }

        message.channel.bulkDelete(amount, true).catch(err => {
            return 'There was an error trying to delete messages in this channel...';
        });

    },
};