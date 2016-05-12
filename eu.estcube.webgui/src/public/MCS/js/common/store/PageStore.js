define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dojo/_base/array",
    "config/config",
    "config/db",
    ],

    function(Memory, Observable, Arrays, Config, DataBase) {
        var store = new Observable(new Memory({ idProperty: "id" }));
        Arrays.forEach(DataBase, function(row) {
            store.put(row);
        });
        return store;
    }
);