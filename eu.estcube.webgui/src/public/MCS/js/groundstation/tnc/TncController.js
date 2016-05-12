define([
    "dojo/_base/declare",
    "common/Controller",
    "./TncView",
    ],

    function(declare, Controller, TncView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new TncView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
