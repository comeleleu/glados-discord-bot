module.exports = {
    name: 'rss',
    description: 'Get the list, create, update, or remove rss feeds to be notified (on this channel) when a new content has been added.'+
        '\n- Use list to get all the active feeds for this server.'+
        '\n- Use create to add a new rss feed.'+
        '\n- Use update when you want to change channel for notifications.'+
        '\n- Use remove to disable an existing rss feed.',
    usage: '<list|create|update|remove> <url>',
    args: true,
    guildOnly: true,

    execute(message, args, client, db) {
        let serverId = message.guild.id;
        let channelId = message.channel.id;
        let url = args[1];
        let reply;

        switch(args[0]) {
            case 'valid':
                url = this.isValidUrl(url);

                if (url != false) {
                    reply = this.isValidRssFeed(url, function(response) {
                        if (response == true) {
                            reply = 'rss feed url good';
                        } else {
                            reply = 'rss feed not valid...';
                        }
                        return reply;
                    });
                    console.log(reply);
                } else {
                    reply = 'url not valid...';
                }
                break;

            case 'list':
                reply = this.listRssFeed(client, db, serverId);
                break;

            case 'create':
                reply = this.createRssFeed(db, serverId, channelId, url);
                break;

            case 'update':
                reply = this.updateRssFeed(db, serverId, channelId, url);
                break;

            case 'remove':
                reply = this.removeRssFeed(db, serverId, url);
                break;
        }

        return reply;
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

        parser.parseURL(url, function (err, feed) {
            if (err) {
                console.log("An error has occurred. Abort everything!");
                return callback(false);
            }
            return callback(true);
        });
    },

    listRssFeed(client, db, serverId) {
        reply = 'Rss feeds available:';

        let feeds = db.get('rss')
            .filter({ serverId: serverId, active: true })
            .value();
        
        feeds.forEach(feed => {
            reply += `\n- ${feed.url} on ${client.channels.cache.get(feed.channelId)}`;
        }); 

        return reply;
    },

    createRssFeed(db, serverId, channelId, url) {
        let feed = this.getRssFeed(db, serverId, url);

        if (typeof feed == 'undefined') {

            if(this.isValidRssFeed(url)) {
                db.get('rss')
                .push({ serverId: serverId, channelId: channelId, url: url, active: true })
                .write();

                reply = 'The rss feed has been created';
            } else {
                reply = 'The rss feed url isn\'t valid...';
            }

        } else if(feed.active == true) {
            reply = 'The rss feed already exist and can\'t be created...';

        } else {
            db.get('rss')
                .find({ serverId: serverId, url: url })
                .assign({ channelId: channelId, active: true })
                .write();

            reply = 'The rss feed has been restored';
        }

        return reply;
    },

    updateRssFeed(db, serverId, channelId, url) {
        let feed = this.getRssFeed(db, serverId, url);

        if (typeof feed == 'undefined') {
            reply = 'The rss feed doesn\'t exist...';

        } else if(feed.active == true) {
            db.get('rss')
                .find({ serverId: serverId, url: url })
                .assign({ channelId: channelId, active: true })
                .write();

            reply = 'The rss feed has been updated';

        } else {
            reply = 'The rss feed is disabled and can\'t be updated...';
        }

        return reply;
    },

    removeRssFeed(db, serverId, url) {
        let feed = this.getRssFeed(db, serverId, url);

        if (typeof feed == 'undefined') {
            reply = 'The rss feed doesn\'t exist...';

        } else if(feed.active == true) {
            db.get('rss')
                .find({ serverId: serverId, url: url })
                .assign({ active: false })
                .write();

            reply = 'The rss feed has been disabled';

        } else {
            reply = 'The rss feed is already disabled...';
        }

        return reply;
    }
};