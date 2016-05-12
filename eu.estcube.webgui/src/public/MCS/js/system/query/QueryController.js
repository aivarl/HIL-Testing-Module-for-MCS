define([
    "dojo/_base/declare",
    "common/Controller",
    "./QueryView",
    ],

    function(declare, Controller, QueryView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new QueryView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            }

        });
        return new s();
    }
);
