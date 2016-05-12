define([
    "dojo/_base/declare",
    "common/Controller",
    "./ContactsView",
    ],

    function(declare, Controller, ContactsView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new ContactsView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
