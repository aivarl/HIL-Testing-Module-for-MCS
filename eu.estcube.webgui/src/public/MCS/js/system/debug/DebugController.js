define([
    "dojo/_base/declare",
    "common/Controller",
    "./DebugView",
    ],

    function(declare, Controller, DebugView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new DebugView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
