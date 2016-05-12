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
    "common/store/MissionInformationStore",
    "dijit/layout/ContentPane",  
    "common/store/ResolveById",
        ], 
    function(declare, Lang, Arrays, Aspect, DomClass, Grid, Misc, ContentProvider, TransportFrameStore, DateFormatter, Ax25AddressFormatter, MissionInformationStore,  ContentPane,ResolveById) {
        return declare(ContentProvider, {
        	
            grid: null,
            store: TransportFrameStore,
            lookupStore: TransportFrameStore,
            getContent: function (args) {
                declare.safeMixin(this, args);
                AX25Grid = new Grid({
                    id: "fillAX25ContentProvider",
                    columns: this.columns || {
                        timestamp: {
                            label: "Timestamp",
                            field: "timestamp",
                            formatter: DateFormatter,
                            className: "field-AX25TimestampColumn",
                        },
                        groundStation: {
                            label: "Ground Station",
                            field: "headers",
                            renderCell: function (object, value, node) {
                                ResolveById(value.groundStationId, node);
                            },
                            className: "field-AX25GsColumn",
                        },
                    },
                    store: this.store,
                    query: function (item) {
                 		   return item.headers["class"] == "Ax25UIFrame";
                    		}                       
                    
                });

                Aspect.after(AX25Grid, "renderRow", function (row, object) {
                    var link = object[0].headers.communicationLinkType;
                    if (link == "Downlink") {
                        DomClass.add(row, "downlink");
                    }
                    return row;
                });

                setTimeout(function () {
                    AX25Grid.set("showHeader", true), AX25Grid.set("sort", "timestamp", true)
                }, 500);

                return AX25Grid;
            },
        });
    });