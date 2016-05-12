define([
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/dom-construct", 
        "dojo/dom-class", 
        "dgrid/OnDemandGrid", 
        "dijit/layout/TabContainer", 
        "dijit/layout/ContentPane", 
        "config/config", 
        "common/formatter/DateFormatter", 
        "common/formatter/Ax25AddressFormatter", 
        "common/store/TransportFrameStore", 
        "common/store/MissionInformationStore", 
        "common/display/Ax25UiFramesContentProvider", 
        "common/display/TncFrameContentProvider",
        "common/store/ResolveById"
        ],

    function (declare, Lang, DomConstruct, DomClass, Grid, TabContainer, ContentPane, config, DateFormatter, Ax25AddressFormatter, store, MissionInformationStore, AX25UIFramesContentProvider, TNCFrameContentProvider,ResolveById) {
        return declare([], {
            constructor: function (args) {
            	this.groundStation = MissionInformationStore.getGroundStation();
             
                var tncProvider = new TNCFrameContentProvider({
                    columns: {
                        timestamp: {
                            label: "Timestamp",
                            field: "timestamp",
                            formatter: DateFormatter,
                            className: "field-timestamp",
                        },
                        type: {
                            label: "Type",
                            field: "headers",
                            formatter: function (headers) {
                                return headers.communicationLinkType;
                            },
                            className: "field-communication-link-type",
                        },
                        groundStation: {
                            label: "Ground Station",
                            field: "headers",
                            renderCell: function(object, value, node, options) {    
                                ResolveById(value.groundStationId, node);        
                         },
                            className: "field-groundStation",
                        },
                        satellite: {
                            label: "Satellite",
                            field: "headers",
                            renderCell: function(object, value, node, options) {                           
                                ResolveById(value.satelliteId, node);                        
                         },
                            className: "field-satellite",
    
                        },
                        orbit: {
                            label: "Orbit",
                            field: "headers",
                            formatter: function (headers) {
                                return headers.orbitNumber || -2;
                            },
                            className: "field-orbit",
                        },
                        source: {
                            label: "Source",
                            field: "headers",
                            renderCell: function (object, value, node, options) {
                                node.innerHTML = object.headers.issuedBy + " : " + object.headers.serialPortName + " : " + object.frame.target;
                            },
                            className: "field-source",
                        },
                        hexDump: {
                            label: "HEX Dump",
                            field: "frame",
                            formatter: function (frame) {
                                return frame.data;
                            },
                            className: "field-value",
                        },
                    },
                });
                
                var tncGrid = tncProvider.getContent();
                var ax25Provider = new AX25UIFramesContentProvider({
    
                    columns: {
                        timestamp: {
                            label: "Timestamp",
                            field: "timestamp",
                            formatter: DateFormatter,
                            className: "field-timestamp",
                        },
                        type: {
                            label: "Type",
                            field: "headers",
                            formatter: function (headers) {
                                return headers.communicationLinkType;
                            },
                            className: "field-communication-link-type",
                        },
                        groundStation: {
                            label: "Ground Station",
                            field: "headers",
                            renderCell: function(object, value, node, options) {                           
                                 ResolveById(value.groundStationId, node);               
                          },
                            className: "field-groundStation",
                        },
                        satellite: {
                            label: "Satellite",
                            field: "headers",
                            renderCell: function(object, value, node, options) {                           
                                 ResolveById(value.satelliteId, node);                        
                          },
                            className: "field-satellite",
    
                        },
                        orbit: {
                            label: "Orbit",
                            field: "headers",
                            formatter: function (headers) {
                                return headers.orbitNumber || -3;
                            },
                            className: "field-orbit",
                        },
                        source: {
                            label: "Source",
                            field: "headers",
                            renderCell: function (object, value, node, options) {
                                var tncPort=object.headers.tncPort;
                                if(tncPort==undefined){
                                    tncPort="...";
                                }
                                
                                node.innerHTML = object.headers.issuedBy + " : " + (object.headers.serialPortName || "-") + " : " + tncPort;
                            },
                            className: "field-issuedBy",
                        },
                        destination: {
                            label: "Destination Address",
                            field: "frame",
                            formatter: function (frame) {
                                return Ax25AddressFormatter(frame.destAddr);
                            },
                            className: "frame-address",
                        },
                        sourceAdress: {
                            label: "Source Address",
                            field: "frame",
                            formatter: function (frame) {
                                return Ax25AddressFormatter(frame.srcAddr);
                            },
                            className: "frame-address",
                        },
                        info: {
                            label: "Info",
                            field: "frame",
                            formatter: function (frame) {
                                return frame.info;
                            },
                            className: "field-value",
                        },
                    }
    
                });
                var ax25Grid = ax25Provider.getContent();
                this.tabContainer = new TabContainer({
                    "class": "fill"
                });
                this.tabContainer.addChild(this.prepareGrid(
                ax25Grid, "AX.25 UI Frames"));
                this.tabContainer.addChild(this.prepareGrid(
                tncGrid, "TNC Frames"));
            },
            placeAt: function (container) {
                this.tabContainer.placeAt(container);
                this.tabContainer.startup();
            },
            prepareGrid: function (grid, title) {
                DomClass.add(grid.domNode, "fill");
                var gridPlaceholder = DomConstruct.create("div", {
                    "class": "fill"
                });
                DomConstruct.place(grid.domNode, gridPlaceholder);
                var contentPane = new ContentPane({
                    title: title,
                    content: gridPlaceholder
                });
                // XXX - 14.03.2013, kimmell - fix for dgrid header
                // not visible bug
                 contentPane.on("show", function () {
                    grid.set("showHeader", true);
                });
                return contentPane;
            },
    
        });
    });