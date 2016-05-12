define([
    "dojo/_base/declare",
    "common/Controller",
    "./WebCamView",
    ],

    function(declare, Controller, WebCamView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new WebCamView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
