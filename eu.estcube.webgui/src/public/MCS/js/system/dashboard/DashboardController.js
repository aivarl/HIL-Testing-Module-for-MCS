define([
    "dojo/_base/declare",
    "common/Controller",
    "./DashboardView",
    ],

    function(declare, Controller, DashboardView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new DashboardView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
