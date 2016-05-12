define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dojox/string/sprintf",
    "config/config",
    "./DataHandler",
    "./StoreMonitor",
    ],

    function(Memory, Observable, sprintf, Config, DataHandler, StoreMonitor) {

        var channel = Config.WEBSOCKET_PARAMETERS;
        var storeId = "ID";

        var store = new Observable(new Memory({ idProperty: storeId }));
        new StoreMonitor({ store: store, storeName: "ParameterStore" });

        var handler = new DataHandler({ channels: [channel], callback: function(message, channel) {
        	
        	if (message["class"] && !(message.value == "KeepAlive")) {
				var oldValue = store.get(message[storeId]);
				if (oldValue == null || oldValue.timestamp < message.timestamp || (oldValue.timestamp == message.timestamp && message["class"] == "CalibratedParameter")) {
					// there is no value for the id in the store; add new value
					// existing value has older timestamp than message; update
					// existing value has the same timestamp as the message; if the message is a calibrated parameter; update
					message["rawValue"] = message["value"];
					if (message["class"] == "CalibratedParameter"){
						if (message["formatPattern"] != null && message["formatPattern"] != ""){
							message["value"] = sprintf(message["formatPattern"], message["calibratedValue"]);
						} else {
							message["value"] = message["calibratedValue"];
						}
					}
					store.put(message);
				}
        	}
            // else message's timestamp is older than stored value timestamp; ignore
        }});

        return store;
    });