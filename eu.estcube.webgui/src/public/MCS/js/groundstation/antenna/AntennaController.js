define([
    "dojo/_base/declare",
    "common/Controller",
    "./AntennaView",
    ],

    function(declare, Controller, AntennaView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new AntennaView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);