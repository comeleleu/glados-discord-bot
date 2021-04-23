module.exports = {
    name: 'rss',
    aliases: ['feed', 'pfp'],
    description: 'List, create, update, or remove RSS feed notifications',
    usage: '<list|create|update|remove> [url]',
    args: true,
    guildOnly: true,
    deleteMessage: true,
    hiddenCommand: false,
    permission: 'MANAGE_CHANNELS',
    cooldown: 0,

    execute(message, args, client, db) {
        switch(args[0]) {
            case 'list':
                this.listRssFeed(client, db, message);
                break;

            case 'create':
                this.createRssFeed(db, message, args[1]);
                break;

            case 'update':
                this.updateRssFeed(db, message, args[1]);
                break;

            case 'remove':
                this.removeRssFeed(db, message, args[1]);
                break;

            default:
                message.author.send('This option doesn\'t exist, input --help or -h for more details');
                break;
        }
    },

    getRssFeed(db, serverId, url) {
        let feed = db.get('rss')
            .filter({ serverId: serverId, url: url })
            .value();

        return feed[0];
    },

    isValidUrl(url) {
        let validate = require('url-validator');

        return validate(url);
    },

    isValidRssFeed(url, callback) {
        let Parser = require('rss-parser');
        let parser = new Parser();

        parser.parseURL(url, function (err) {
            if (err) {
                return callback(false);
            }
            return callback(true);
        });
    },

    listRssFeed(client, db, message) {
        let serverId = message.guild.id;

        reply = 'Rss feeds available:';

        let feeds = db.get('rss')
            .filter({ serverId: serverId, active: true })
            .value();
        
        feeds.forEach(feed => {
            reply += `\n- ${feed.url} on ${client.channels.cache.get(feed.channelId)}`;
        }); 

        message.author.send(reply);
    },

    createRssFeed(db, message, url) {
        let serverId = message.guild.id;
        let channelId = message.channel.id;
        let feed = this.getRssFeed(db, serverId, url);

        if (typeof feed == 'undefined') {

            url = this.isValidUrl(url);

            if (url != false) {
                this.isValidRssFeed(url, function(response) {
                    if (response == true) {

                        db.get('rss')
                            .push({ serverId: serverId, channelId: channelId, url: url, active: true })
                            .write();

                        message.author.send('The rss feed has been created');

                    } else {
                        message.author.send('The rss feed entered isn\'t valid...');
                    }
                });
            } else {
                message.author.send('The URL entered isn\'t valid...');
            }

        } else if(feed.active == true) {
            message.author.send('The rss feed already exist and can\'t be created...');

        } else {
            db.get('rss')
                .find({ serverId: serverId, url: url })
                .assign({ channelId: channelId, active: true })
                .write();

            message.author.send('The rss feed has been restored');
        }
    },

    updateRssFeed(db, message, url) {
        let serverId = message.guild.id;
        let channelId = message.channel.id;
        let feed = this.getRssFeed(db, serverId, url);

        if (typeof feed == 'undefined') {
            message.author.send('The rss feed doesn\'t exist...');

        } else if(feed.active == true) {
            db.get('rss')
                .find({ serverId: serverId, url: url })
                .assign({ channelId: channelId, active: true })
                .write();

            message.author.send('The rss feed has been updated');

        } else {
            message.author.send('The rss feed is disabled and can\'t be updated...');
        }
    },

    removeRssFeed(db, message, url) {
        let serverId = message.guild.id;
        let feed = this.getRssFeed(db, serverId, url);

        if (typeof feed == 'undefined') {
            message.author.send('The rss feed doesn\'t exist...');

        } else if(feed.active == true) {
            db.get('rss')
                .find({ serverId: serverId, url: url })
                .assign({ active: false })
                .write();

            message.author.send('The rss feed has been disabled');

        } else {
            message.author.send('The rss feed is already disabled...');
        }
    }
};