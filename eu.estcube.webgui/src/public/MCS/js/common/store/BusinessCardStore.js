define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "config/config",
    "./DataHandler",
    "./StoreMonitor",
    ],

    function(Memory, Observable, Config, DataHandler, StoreMonitor) {

        var channel = Config.WEBSOCKET_BUSINESS_CARDS;
        var storeId = "name";

        var store = new Observable(new Memory({ idProperty: storeId }));
        new StoreMonitor({ store: store, storeName: "BusinessCardStore" });

        var handler = new DataHandler({ channels: [channel], callback: function(message, channel) {
            message.status = "OK"; // XXX - 10.03.2013, kimmell - figure out better place to set the default status of the component
            store.put(message);
        }});

        return store;
    }
);