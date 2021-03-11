module.exports = {
    name: 'rss',
    execute(client, db) {

        let Parser = require('rss-parser');
        let parser = new Parser();

        let feeds = db.get('rss')
            .filter({ active: true })
            .value();

        feeds.forEach(feed => {

            (async () => {

                feedContent = await parser.parseURL(feed.url);

                if (typeof feed.lastItemLink !== 'undefined') {

                    this.sendMessages(client, feed, feedContent);

                }

                this.saveLastItemLink(db, feed, feedContent)

            })();
            
        });

    },

    saveLastItemLink(db, feed, feedContent) {
        db.get('rss')
            .find({ serverId: feed.serverId, url: feed.url })
            .assign({ lastItemLink: feedContent.items[0].link })
            .write();
    },

    sendMessages(client, feed, feedContent) {
        let publish = false;

        feedContent.items.slice().reverse().forEach(feedContentItem => {
            if (publish == true) {
                client.channels.cache.get(feed.channelId).send(`@everyone ${feedContentItem.title} ${feedContentItem.link}`);
            }
            else if (feedContentItem.link == feed.lastItemLink) {
                publish = true;
            }
        });
    }
};