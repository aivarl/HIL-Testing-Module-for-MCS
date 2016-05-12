define([
        "dojo/_base/declare",
        "common/Controller",
        "./SettingsView",
        ],

    function(declare, Controller, SettingsView) {
        var s = declare([Controller], {

            constructor: function() {
                this.dashView = new SettingsView();	//Difference between view and dashView????
            },

            index: function(params) {
                this.placeWidget(this.dashView);
            },
        });
        return new s();
    }
);
