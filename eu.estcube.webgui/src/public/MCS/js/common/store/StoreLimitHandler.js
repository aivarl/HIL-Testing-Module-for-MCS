define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "config/config",
    ],

    function(declare, Arrays, Config) {

        return {
            put: function(store, item, limit) {
                store.put(item);
                var overLimit = store.data.length - limit;
                if (overLimit > 0) {
                    store.query({}, { start: 0, count: overLimit }).forEach(function(item) {
                        var id = item[store.idProperty];
                        store.remove(id);
                    });
                }
            }
        };
    }
);
