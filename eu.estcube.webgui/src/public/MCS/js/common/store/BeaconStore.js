define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dojo/_base/array",
    "config/config",
    "dojo/request",
    "./StoreMonitor"
    ],

    function (Memory, Observable, Arrays, Config, Request, StoreMonitor) {
        var store = new Observable(new Memory({ idProperty: "timestamp" }));
        var beacon;
        store.update = function () {
            Request.get(Config.URL_CATALOGUE_BEACONS, { handleAs: "json" }).then(function (beacons) {
                Arrays.forEach(beacons, function (item) {
                    if (item == null) {
                        store.put(beacon);
                    }
                    else if (item.class == "Label") {
                        beacon = item;
                    } else {
                        store.put({
                            timestamp: beacon.timestamp,
                            issuedBy: beacon.issuedBy,
                            value: beacon.value,
                            insertedBy: item.metadata.insertedBy
                        })
                    } 
                });
            });
        }

        store.update();

        setInterval(function () { store.update() }, Config.BEACON_UPDATE_INTERVAL);

        new StoreMonitor({ store: store, storeName: "BeaconStore" });

        return store;
    }
);