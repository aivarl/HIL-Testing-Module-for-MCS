define([
    "dojo/store/Memory",
    "dojo/store/Observable",
    "config/config",
    "./DataHandler",
    "./StoreMonitor",
    ],

    function(Memory, Observable, Config, DataHandler, StoreMonitor) {
        var audioElementName = "setting";
        var store = new Observable(new Memory({ idProperty: audioElementName }));
        return store;
        
    }
);