define([
    "dojo/_base/declare",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dgrid/OnDemandGrid",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "config/config",
    "common/store/DiagnosticsStore",
    "common/formatter/DateFormatter",
    "common/formatter/StatusFormatter",
    "common/display/DiagnosticsContentProvider",
   ],

    function(declare, DomClass, DomConstruct, Grid, TabContainer, ContentPane, Config, DiagnosticsStore, DateFormatter, StatusFormatter,DiagnosticsContentProvider) {

        return declare([], {

            constructor: function(args) {
            	this.dcp = new DiagnosticsContentProvider(); 
                this.tabContainer = this.dcp.getContent();
            },
            placeAt: function(container) {
                this.tabContainer.placeAt(container);
                this.tabContainer.startup();
                this.dcp.restyleGrids();
            },


        });
    }
);
