define([
    "dojo/_base/declare",
    "common/Controller",
    "./DashboardView",
    ],

    function(declare, Controller, DashboardView) {
        console.log("DashboardController");
        var s = declare([Controller], {

            constructor: function() {
                console.log("DashboardController.constructor");
                this.view = new DashboardView();
            },

            index: function(params) {
                console.log("DashboardController.index");
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);