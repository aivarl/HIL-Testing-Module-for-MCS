define([
    "dojo/_base/declare",
    "common/Controller",
    "./DiagnosticsView",
    ],

    function(declare, Controller, DiagnosticsView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new DiagnosticsView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
