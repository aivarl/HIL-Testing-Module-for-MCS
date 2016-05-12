define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/topic",
    "config/config",
    "./CacheHandler",
    ],

    function(declare, Arrays, Topic, Config, CacheHandler) {

        var id = 0;

        return declare([], {

            cacheRequest: true,
            cacheRequestTimeout: 1000,

            constructor: function(args) {
                this.name = "DataHandler-" + (++id);
                declare.safeMixin(this, args);
                this.subscribeToChannels();
                console.log("[" + this.name + "] Done");
            },

            subscribeToChannels: function() {
                if (this.channels == null) {
                    return;
                }

                var channelHandler = this.callback;
                Arrays.forEach(this.channels, function(channel, i) {
                    console.log("[" + this.name + "] Processing channel[" + i + "]: " + channel);

                    // setup cache request if not turned off
                    if (this.cacheRequest) {
                        CacheHandler.addChannel(channel, this.cacheRequestTimeout);
                    }

                    console.log("[" + this.name + "]  Subscribing to " + channel);
                    try {
                        // listen all messages from the channel
                        Topic.subscribe(channel, dojo.hitch(this, function(message) {
                            channelHandler(message.data, message.channel);
                        }));
                        // publish channel request for the channel
                        Topic.publish(Config.TOPIC_CHANNEL_REQUEST, { channel: channel, source: this.name });
                    } catch (e) {
                        console.error("[" + this.name + "] Failed to subscribe to channel " + channel + "; " + e);
                    }
                }, this);
            },
        });

    }
);
