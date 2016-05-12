define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-class",
    "common/display/LogContentProvider",
    ],

    function(declare, Lang, DomConstruct, DomClass, LogContentProvider) {

        return declare([], {

            constructor: function(args) {
                this.grid = new LogContentProvider().getContent();
                DomClass.add(this.grid.domNode, "fill");

            },

            placeAt: function(container) {
                DomConstruct.place(this.grid.domNode, container);
            },

        });
    }
);
