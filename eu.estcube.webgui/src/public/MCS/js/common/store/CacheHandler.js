define([
    "dojo/_base/lang",
    "dojo/topic",
    "config/config",
    ],

    function(Lang, Topic, Config) {

        var handler = {
            channels: [],

            addChannel: function(channel, requestTimeout) {
                // add only new channels & /hbird.out.all
                if (this.channels.indexOf(channel) < 0 || Config.WEBSOCKET_ALL == channel) {

                    // update channel list
                    this.channels.push(channel);
                    console.log("[CacheHandler] adding channel " + channel + " with request timeout " + requestTimeout);

                    // subscribe to channel event topic
                    var subscription = Topic.subscribe(Config.TOPIC_CHANNEL_EVENT, Lang.hitch(this, function(event) {
                        if (event.eventType == "Connected" && event.channel == channel) {
                            // channel is connected now; remove topic subscription
                            subscription.remove();
                            console.log("[CacheHandler]  Scheduling cache request for the channel " + channel);
                            // load cache after timeout
                            setTimeout(Lang.hitch(this, function() {
                                console.log("[CacheHandler]  Issuing cache request to the channel " + channel);
                                // send message to channel to trigger cache loading from server
                                Topic.publish(Config.TOPIC_CHANNEL_SEND_MESSAGE, { channel: channel, data: "cache" });
                            }), requestTimeout);
                        }
                    }));
                }
            },

        };
        return handler;
    }
);