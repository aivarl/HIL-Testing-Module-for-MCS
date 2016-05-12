define([
    "dojo/request/notify",
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dojo/topic",
    "config/config",
    ],

    function(Notify, Memory, Observable, Topic, Config) {

        var storeId = "storeId";

        var store = new Observable(new Memory({ idProperty: storeId }));

        function getOrCreateXhrEntry(request, store) {
            // Using method + URL as store id
            var opts = request.options || request.response.options;
            var method = opts.method;
            var url = request.url || request.response.url;
            var requestName =  method + url;
            var entry = store.get(requestName);
            if (!entry) {
                entry = { category: "xhr" };
                entry[storeId] = requestName;
                entry.method = method;
                entry.url = url;
            }
            return entry;
        }

        function updateProperty(entry, type) {
            var val = entry[type];
            if (val) {
                entry[type] = parseInt(val) + 1;
            } else {
                entry[type] = 1;
            }
            return entry;
        }

        // listen store events
        Topic.subscribe(Config.TOPIC_STORE_EVENT, function(message) {
            // using store name as store id
            var storeName = message.storeName;
            var entry = store.get(storeName);
            if (!entry) {
                entry = { category: "store" };
                entry[storeId] = storeName;
                entry.storeName = storeName;
            }
            entry.storeSize = message.storeSize;
            entry = updateProperty(entry, message.eventType);
            entry.timestamp = Date.now();
            store.put(entry);
        });

        // listen channel requests
        Topic.subscribe(Config.TOPIC_CHANNEL_REQUEST, function(message) {
            Topic.subscribe(message.channel, function(message) {
                // using channel name as store id
                var entry = store.get(message.channel);
                if (entry) {
                    entry.lastMessage = Date.now();
                    entry = updateProperty(entry, "in");
                    store.put(entry);
                }
            });
        });

        // listen sent channel messages
        Topic.subscribe(Config.TOPIC_CHANNEL_SEND_MESSAGE, function(message) {
            // using channel name as store id
            var entry = store.get(message.channel);
            if (entry) {
                entry.lastMessage = Date.now();
                entry = updateProperty(entry, "out");
                store.put(entry);
            }
        });

        // listen channel events
        Topic.subscribe(Config.TOPIC_CHANNEL_EVENT, function(message) {
            // using channel name as store id
            var channelName = message.channel;
            var entry = store.get(channelName);
            if (!entry) {
                entry = { category: "socket" };
                entry[storeId] = channelName;
                entry.channel = channelName;
            }
            entry.status = message.eventType;
            entry.source = message.source;
            entry.error = message.error;
            entry.timestamp = Date.now();
            store.put(entry);
        });

        // listen all send events from dojo/request
        Notify("send", function(request) {
            var entry = getOrCreateXhrEntry(request, store);
            entry.lastRequest = Date.now();
            entry.status = "In progress";
            entry = updateProperty(entry, "out");
            store.put(entry);
        });

        // listen all done events from dojo/request
        Notify("done", function(request) {
            var entry = getOrCreateXhrEntry(request, store);
            if (request.status == 200) { // HTTP OK
                entry.lastSuccess = Date.now();
                entry.status = "OK";
                entry = updateProperty(entry, "success");
            } else {
                entry.lastFailure = Date.now();
                // TODO - 08.04.2013, kimmell - handle other cases than xhr
                var statusText = request.response.xhr ? request.response.xhr.statusText : "";
                entry.status = "Error (code: " + request.response.status + "; " + statusText  + ")";
                entry = updateProperty(entry, "failure");
                store.put(entry);
            }
            store.put(entry);
        });

        return store;
    }
);