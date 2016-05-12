define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "config/config",
    "./DataHandler",
    "./StoreIdGenerator",
    "./StoreLimitHandler",
    "./StoreMonitor",
    ],

    function(Memory, Observable, Config, DataHandler, IdGenerator, StoreLimitHandler, StoreMonitor) {

        var channel = Config.WEBSOCKET_PARAMETERS;
        var storeId = "ID";

        var store = new Observable(new Memory({ idProperty: storeId }));
        new StoreMonitor({ store: store, storeName: "SystemLogStore" });

        var handler = new DataHandler({ channels: [channel], callback: function(message, channel) {
            if( message.ID.substr(0,30) == "/ESTCUBE/Satellites/ESTCube-1/" && message["class"] != "Metadata" ) { // TODO - 09.05.2013, kimmell - move to conf!
                StoreLimitHandler.put(store, message, 500);
            }
        }});

        return store;
    }
);