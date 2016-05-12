define([
    "dojo/_base/declare",
    "common/Controller",
    "./MapView",
    ],

    function(declare, Controller, MapView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new MapView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },
            
            clear: function() {
            	this.view.destroy();
            }

        });
        return new s();
    }
);
