define([
    "dojo/_base/declare",
    "common/Controller",
    "./WeatherView",
    ],

    function(declare, Controller, WeatherView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new WeatherView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
