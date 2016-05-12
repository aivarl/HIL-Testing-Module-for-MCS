define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "config/config",
    "common/Controller",
    "./BeaconView"
    ],

    function(declare, Arrays, Lang, Config, Controller, BeaconView ) {
        var s = declare([Controller], {

            constructor: function() {
                  this.view = new BeaconView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },


        });
        return new s();
    }
);
