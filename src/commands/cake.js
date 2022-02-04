module.exports = {
    name: 'cake',
    description: 'This is a secret',
    usage: '',
    args: false,
    guildOnly: true,
    deleteMessage: true,
    hiddenCommand: true,
    permissions: 'SEND_MESSAGES',
    cooldown: 60*15,

    execute(message, args, client, db) {

        let responses = [
            "Quit now and cake will be served immediately.",
            "Cake and grief counseling will be available at the conclusion of the test.",
            "The Enrichment Center is required to remind you that you will be baked, and then there will be cake.",
            "Uh oh. Somebody cut the cake. I told them to wait for you, but they did it anyway. There is still some left, though, if you hurry back.",
            "I'm going to kill you, and all the cake is gone.",
            "Who's gonna make the cake when I'm gone? You?",
            "There really was a cake...",
        ];

        let key = Math.floor(Math.random() * responses.length);

        message.reply(`${responses[key]}`);

    },
};