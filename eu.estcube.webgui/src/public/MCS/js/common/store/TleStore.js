define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "config/config",
    "./DataHandler",
    "./StoreMonitor",
    ],

    function(Memory, Observable, Config, DataHandler, StoreMonitor) {

        var channel = Config.WEBSOCKET_ALL;
        var storeId = "timestamp";

        var store = new Observable(new Memory({ idProperty: storeId }));
        new StoreMonitor({ store: store, storeName: "TleStore" });

        store.handle = function(message, channel) {
            if (message["class"] === "TleOrbitalParameters") {
                store.put(message);
            }
        };

        var handler = new DataHandler({ channels: [channel], callback: store.handle });

        return store;
    }
);