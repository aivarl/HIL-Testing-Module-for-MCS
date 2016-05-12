define([
    "dojo/_base/declare",
    "common/Controller",
    "./BeaconsView",
    ],

    function(declare, Controller, BeaconsView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new BeaconsView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);