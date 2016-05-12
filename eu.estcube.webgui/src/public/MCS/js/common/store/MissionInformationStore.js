define([
    "dojo/cookie",
    "dojo/store/Memory",
    "dojo/_base/array",
    "dojo/store/Observable",
    "config/config",
    "dojo/request",
    "./StoreMonitor",
    "common/net/IDEncoder"
    ],

    function(Cookie, Memory, Arrays, Observable, Config, Request, StoreMonitor, IDEncoder) {
        var store = new Observable(new Memory({ idProperty: "ID" }));
        new StoreMonitor({ store: store, storeName: "MissionInformationStore" });

        // UserInfo
        Request.get( "/user", {handleAs: "json"} ).then(
            function(data) {
                data.class = "UserInfo";   // add class key to userInfo
                store.put(data);
            }
        );

        Request.get(Config.URL_CATALOGUE_SATELLITES, {handleAs: "json"})
            .then(function(data) {
                Arrays.forEach(data, function(row) {
                    store.put(row);
                });
            }
        );

        Request.get(Config.URL_CATALOGUE_GROUND_STATIONS, {handleAs: "json"})
            .then(function(data) {
                Arrays.forEach(data, function(row) {
                    store.put(row);
                });
                loadContactEvents(store);
            }
        );
        
        store.getGroundStation = function() {
            var id = Cookie("gsSelector");
            if (id == undefined || id == null) {
            	id = "/ESTCUBE/GroundStations/ES5EC";
            }
            var gs = store.get(id);
            if (gs == undefined || gs == null) {
            	gs = {
            		ID: id,
            		name: id.split("/").pop()
            	};
            }
            return gs;
        };
        
        function loadContactEvents(store) {
            Arrays.forEach(store.query({ class: "GroundStation" }), function(gs) {
                Request.get(Config.URL_CATALOGUE_CONTACTS + IDEncoder(gs.ID), { handleAs: "json" })
                    .then(function(data) {
                        Arrays.forEach(data, function(row) {
                            var id = row.ID + ":" + row.orbitNumber;
                            row.ID = id;
                            store.put(row);
                        });
                    });
                }
            );
        }

        setInterval(function() {
            loadContactEvents(store);
        }, Config.CONTACT_UPDATE_INTERVAL);
        
        return store;
    }
);