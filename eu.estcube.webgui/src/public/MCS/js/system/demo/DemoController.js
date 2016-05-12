define([
    "dojo/_base/declare",
    "common/Controller",
    "./DemoView",
    ],

    function(declare, Controller, DemoView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new DemoView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
