define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dojo/_base/array",
    "config/config",
    "dojo/topic",
    "dojo/request",
    "common/messages/SystemMessage",
    "./StoreMonitor",
    "common/net/IDEncoder",
    "dojo/promise/all"
    ],

    function(Memory, Observable, Arrays, Config, Topic, Request, SystemMessage, StoreMonitor, IDEncoder, all) {
        var store = new Observable(new Memory({ idProperty: "id" }));

        // Support for listening on the batch updates - calls
        // callback not on each new row, but once per request
        store.initialized = false;
        store.loadListeners = [];
        store.onUpdate = function(callback) {
            if(this.initialized) {
                callback();
            } else {
                this.loadListeners.push(callback);
            }
        }

        function Update() {
            Request.get(Config.URL_CATALOGUE_SATELLITES, {handleAs: "json"}).then(function(satellites) {
                var requestsDone = all(Arrays.map(satellites, function(sat) {
                    return Request.get(Config.URL_CATALOGUE_ORBITAL_STATES + IDEncoder(sat.ID), { handleAs: "json" }).then(
                            function(data) {
                                Arrays.forEach(data, function(state) {
                                    state.id = state.satelliteId + "@" + state.timestamp;
                                    store.put(state);
                                });
                            },

                            function(error) {
                                Topic.publish(Config.TOPIC_SYSTEM_MESSAGES, new SystemMessage({
                                    level: "ERROR",
                                    value: "Failed to load Orbital States; " + error,
                                }));
                            }
                    );
                }));

                requestsDone.then(function() {
                    Arrays.forEach(store.loadListeners, function(callback) {
                        callback();
                    });

                    store.initialized = true;
                });
            });
        }

        Update();

        setInterval(Update, Config.ORBITAL_STATE_UPDATE_INTERVAL);

        new StoreMonitor({ store: store, storeName: "OrbitalStateStore" });

        return store;
    }
);