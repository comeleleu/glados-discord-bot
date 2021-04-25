module.exports = {
    name: 'rss',
    
    execute(client, db) {

        const dbModule = client.modules.get('db');
        let feeds = dbModule.findAll(db, 'rss', { active: true });

        feeds.forEach(feed => {

            (async () => {

                let url = this.isValidUrl(feed.url);

                if (url != false) {
                    this.getFeedContent(url, function(response) {
                        if (response != false) {

                            if (typeof feed.lastItemLink !== 'undefined') {
                                let published = false;

                                response.items.slice().reverse().forEach(responseItem => {
                                    if (published == true) {
                                        client.channels.cache.get(feed.channelId).send(`${responseItem.title} ${responseItem.link}`);
                                    }
                                    else if (responseItem.link == feed.lastItemLink) {
                                        published = true;
                                    }
                                });
                            }
            
                            dbModule.update(db, 'rss', { serverId: feed.serverId, url: feed.url }, { lastItemLink: response.items[0].link });

                        } else {
                            dbModule.delete(db, 'rss', { serverId: feed.serverId, url: url });
                        }
                    });
                } else {
                    dbModule.delete(db, 'rss', { serverId: feed.serverId, url: url });
                }

            })();
            
        });

    },

    isValidUrl(url) {
        const validate = require('url-validator');

        return validate(url);
    },

    getFeedContent(url, callback) {
        const Parser = require('rss-parser');
        let parser = new Parser();

        parser.parseURL(url, function (err, feed) {
            if (err) {
                return callback(false);
            }
            return callback(feed);
        });
    },
};