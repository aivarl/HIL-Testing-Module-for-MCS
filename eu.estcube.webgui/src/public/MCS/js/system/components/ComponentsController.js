define([
    "dojo/_base/declare",
    "common/Controller",
    "./ComponentsView",
    ],

    function(declare, Controller, ComponentsView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new ComponentsView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
