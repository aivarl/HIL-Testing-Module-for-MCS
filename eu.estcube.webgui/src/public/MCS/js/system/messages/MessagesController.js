define([
    "dojo/_base/declare",
    "common/Controller",
    "./MessagesView",
    ],

    function(declare, Controller, MessagesView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new MessagesView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
