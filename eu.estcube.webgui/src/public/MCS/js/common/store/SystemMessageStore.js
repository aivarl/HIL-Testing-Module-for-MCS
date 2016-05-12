define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dojo/topic",
    "config/config",
    "./DataHandler",
    "./StoreIdGenerator",
    "./StoreLimitHandler",
    "./StoreMonitor",
    "common/messages/SystemMessage",
    ],

    function(Memory, Observable, Topic, Config, DataHandler, IdGenerator, StoreLimitHandler, StoreMonitor, SystemMessage) {

        var channel = Config.WEBSOCKET_SYSTEM_MESSAGES;
        var storeId = "storeId";

        var store = new Observable(new Memory({ idProperty: storeId }));

        var handler = new DataHandler({ channels: [channel], callback: function(message, channel) {
        //    console.log(" EVENT: " + JSON.stringify(message));
            if (message["class"] == "Event") {
                var toPublish = new SystemMessage({
                    timestamp: message.timestamp,
                    issuedBy: message.issuedBy,
                    level: "INFO", // TODO - 12.04.2013, kimmell - fix this
                    value: message.issuedBy + " - " + message.description,
                });
                Topic.publish(Config.TOPIC_SYSTEM_MESSAGES, toPublish);
            }
        }});

        Topic.subscribe(Config.TOPIC_SYSTEM_MESSAGES, function(message) {
            StoreLimitHandler.put(store, IdGenerator.generate(message, storeId), Config.STORE_LIMIT_SYSTEM_MESSAGES);
        });

        new StoreMonitor({ store: store, storeName: "SystemMessageStore" });
        return store;
    }
);