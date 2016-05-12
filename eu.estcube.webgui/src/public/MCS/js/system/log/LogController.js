define([
    "dojo/_base/declare",
    "common/Controller",
    "./LogView",
    ],

    function(declare, Controller, LogView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new LogView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
