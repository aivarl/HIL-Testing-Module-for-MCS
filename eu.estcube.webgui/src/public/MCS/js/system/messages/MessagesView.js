define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dgrid/OnDemandGrid",
    "config/config",
    "common/formatter/DateFormatter",
    "common/store/SystemMessageStore",
     "common/display/SystemMessageContentProvider",
    
    ],

    function(declare, Lang, DomConstruct, DomClass, Grid, config, DateFormatter, store,SystemMessageContentProvider) {

        return declare([], {

            constructor: function(args) {
                this.grid = new SystemMessageContentProvider().getContent();
                DomClass.add(this.grid.domNode, "fill");
            },

            placeAt: function(container) {
                DomConstruct.place(this.grid.domNode, container);
            },

        });
    }
);
