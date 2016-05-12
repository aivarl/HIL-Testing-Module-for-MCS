define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "config/config",
    "./DataHandler",
    "./StoreMonitor",
    "dojo/_base/array",
    ],

    function (Memory, Observable, Config, DataHandler, StoreMonitor, Arrays) {



        var channel = Config.WEBSOCKET_ARCHIVE;
        var storeId = "ID";
        var store = new Observable(new Memory({ idProperty: storeId }));
        new StoreMonitor({ store: store, storeName: "ArchiveStore" });


        var handler = new DataHandler({ channels: [channel], callback: function (message, channel) {

            if (!(message.valueOf().message == "KeepAlive")) {
            	if (store.requestId == message.headers.requestId){
	                var array =  message.valueOf().frame;
	                if(array.length == 0){
	                	store.notif("No data to display");
	                } else {
		                array.forEach(function(entry){
	                    	store.put(entry);
		                });
		                store.onRequestComplete();
	                }
            	}
            }
        }
        });
        store.requestId = -1;
        store.onRequestComplete = function(){};
        store.notif = function(){};
        return store;
    }

    );