define([
    "dojo/_base/declare",
    "common/Controller",
    "./AddBeaconsView"
    ],

    function(declare, Controller, AddBeaconsView ) {
        var s = declare([Controller], {

            constructor: function() {
				this.view = new AddBeaconsView();
            },

            index: function(params) {
                this.placeWidget(this.view);
            },

        });
        return new s();
    }
);
