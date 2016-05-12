define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "config/config",
    "./DataHandler",
    "./StoreIdGenerator",
    "./StoreLimitHandler",
    "./StoreMonitor",
    ],

    function(Memory, Observable, Config, DataHandler, IdGenerator, StoreLimitHandler, 
             StoreMonitor) {

        var channel = Config.WEBSOCKET_SYSTEM_LOG;
        var storeId = "storeId";

        var store = new Observable(new Memory({ idProperty: storeId }));
        new StoreMonitor({ store: store, storeName: "SystemLogStore" });

        var handler = new DataHandler({
            channels: [channel],
            callback: function(message, channel) {
                if (message.message !== "KeepAlive") {
                    StoreLimitHandler.put(store, IdGenerator.generate(message, storeId), Config.STORE_LIMIT_SYSTEM_LOG);
                }
        }});

        return store;
    }
);