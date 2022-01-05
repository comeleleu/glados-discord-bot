module.exports = {
    name: 'rss',
    aliases: ['feed'],
    description: 'List, create, update, or delete RSS feed notifications',
    usage: '<list|create|update|delete> [url]',
    args: true,
    guildOnly: true,
    deleteMessage: true,
    hiddenCommand: false,
    permission: 'MANAGE_CHANNELS',
    cooldown: 0,

    execute(client, message, args) {

        switch(args[0]) {
            case 'list':
            case 'show':
            case 'display':
                this.listFeed(client, message);
                break;

            case 'create':
            case 'add':
                this.createFeed(client, message, args);
                break;

            case 'update':
            case 'modify':
            case 'change':
                this.updateFeed(client, message, args);
                break;

            case 'delete':
            case 'remove':
            case 'disable':
                this.deleteFeed(client, message, args);
                break;

            default:
                message.author.send('This option doesn\'t exist, input --help or -h for more details');
                break;
        }
        
    },

    listFeed(client, message) {
        const dbModule = client.modules.get('db');
        let serverId = message.guild.id;
        let feeds = dbModule.findAll(client.db, 'rss', { serverId: serverId, active: true });
        let reply;

        if (feeds.length > 0) {
            reply = 'RSS feed(s) available:';
        
            feeds.forEach(feed => {
                reply += `\n- ${feed.url} on ${client.channels.cache.get(feed.channelId)}`;
            }); 
        } else {
            reply = 'There is no RSS feed on this server';
        } 

        message.author.send(reply);
    },

    createFeed(client, message, args) {
        const dbModule = client.modules.get('db');
        const rssModule = client.modules.get('rss');
        let serverId = message.guild.id;
        let channelId = message.channel.id;
        let url = args[1];
        let feed = dbModule.findOne(client.db, 'rss', { serverId: serverId, url: url });

        if (typeof feed == 'undefined') {

            url = rssModule.isValidUrl(url);

            if (url != false) {
                rssModule.getFeedContent(url, function(response) {
                    if (response != false) {
                        dbModule.insert(client.db, 'rss', { serverId: serverId, channelId: channelId, url: url, active: true, lastItemLink: response.items[0].link });

                        message.author.send('The RSS feed has been created');

                    } else {
                        message.author.send('The RSS feed entered isn\'t valid...');
                    }
                });
            } else {
                message.author.send('The URL entered isn\'t valid...');
            }

        } else if(feed.active == true) {
            message.author.send('The RSS feed already exist and can\'t be created...');

        } else {
            client.db.get('rss')
                .find({ serverId: serverId, url: url })
                .assign({ channelId: channelId, active: true })
                .write();

            message.author.send('The RSS feed has been restored');
        }
    },

    updateFeed(client, message, args) {
        const dbModule = client.modules.get('db');
        let serverId = message.guild.id;
        let channelId = message.channel.id;
        let url = args[1];
        let feed = dbModule.findOne(client.db, 'rss', { serverId: serverId, url: url });

        if (typeof feed == 'undefined') {
            message.author.send('The RSS feed doesn\'t exist...');

        } else if(feed.active == true) {

            if (feed.channelId != channelId) {
                dbModule.update(client.db, 'rss', { serverId: serverId, url: url }, { channelId: channelId });

                message.author.send('The RSS feed has been updated');
            } else {
                message.author.send('The RSS feed is already set for this channel');
            }
            

        } else {
            message.author.send('The RSS feed is disabled and can\'t be updated...');
        }
    },

    deleteFeed(client, message, args) {
        const dbModule = client.modules.get('db');
        let serverId = message.guild.id;
        let url = args[1];
        let feed = dbModule.findOne(client.db, 'rss', { serverId: serverId, url: url });

        if (typeof feed == 'undefined') {
            message.author.send('The RSS feed doesn\'t exist...');

        } else if(feed.active == true) {
            dbModule.update(client.db, 'rss', { serverId: serverId, url: url }, { active: false });

            message.author.send('The RSS feed has been disabled');

        } else {
            message.author.send('The RSS feed is already disabled...');
        }
    }
};