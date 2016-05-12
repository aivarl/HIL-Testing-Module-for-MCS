define([
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/_base/array",
        "dojo/aspect", 
        "dojo/dom-class", 
        "dgrid/OnDemandGrid",
        "dgrid/util/misc", 
        "./ContentProvider",
        "common/store/TransportFrameStore", 
        "common/formatter/DateFormatter",
        "common/formatter/Ax25AddressFormatter", 
        ],
        function(declare, Lang, Arrays, Aspect, DomClass, Grid, Misc, ContentProvider,TransportFrameStore, DateFormatter, Ax25AddressFormatter) {
            return declare(ContentProvider, {
                grid : null,
                store : TransportFrameStore,
                lookupStore : TransportFrameStore,
                getContent: function (args) {

                    declare.safeMixin(this, args);
                    tncGrid = new Grid({
                        columns: this.columns || {},
                        store: this.store,
                        query: function (item) {
                            return item.headers["class"] == "TncFrame";
                        }
                    });

                    Aspect.after(tncGrid, "renderRow", function (row, object) {
                        var link = object[0].headers.communicationLinkType;
                        if (link == "Downlink") {
                            DomClass.add(row, "downlink");
                        } else {
                            DomClass.add(row, "uplink");
                        }
                        return row;
                    });

                    tncGrid.set("sort", "timestamp", true);

                    setTimeout(function () {
                        tncGrid.set("showHeader", true)
                    }, 500);

                    return tncGrid;
                },

                startup: function() {
                    this.grid.startup();
                },  
            });
        });
