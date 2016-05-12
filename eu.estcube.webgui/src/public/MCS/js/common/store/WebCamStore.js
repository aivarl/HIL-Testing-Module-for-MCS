define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "config/config",
    "./DataHandler",
    "./StoreMonitor",
    ],

    function(Memory, Observable, Config, DataHandler, StoreMonitor) {

        var channel = Config.WEBSOCKET_BINARY;
        var storeId = "ID";

        var store = new Observable(new Memory({ idProperty: storeId }));
        new StoreMonitor({ store: store, storeName: "WebCamStore" });

        var handler = new DataHandler({ channels: [channel], callback: function(message, channel) {
            store.put(message);
        }});

        return store;
    }
);