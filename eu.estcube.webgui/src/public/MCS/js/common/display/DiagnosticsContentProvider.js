define([
    "dojo/_base/declare", 
    "dojo/_base/lang", 
    "dojo/_base/array", 
    "dojo/aspect", 
    "dojo/dom-class", 
    "dgrid/OnDemandGrid", 
    "dgrid/util/misc", 
    "./ContentProvider", 
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "common/store/DiagnosticsStore",
    "common/formatter/DateFormatter",
    "common/formatter/StatusFormatter",
    "dojo/dom-construct",

    ], 
    function(declare, Lang, Arrays, Aspect, DomClass, Grid, Misc, ContentProvider, TabContainer, ContentPane,  DiagnosticsStore, DateFormatter, StatusFormatter,DomConstruct) {
        return declare(ContentProvider, {                
            getContent: function () {
            	this.uid = dijit.registry.getUniqueId(this.declaredClass);
            	if(this.styleInner == undefined){
            		this.styleInner = "fill";
            		this.styleOuter = "fill";
            	}
            	else{
            		this.styleInner = "fill-tab-pane";
            		this.styleOuter = "fill-tab";
            		
            	}

                var storeGrid = new Grid({
                    id:"StoreGrid_" + this.uid,
                    store: DiagnosticsStore,
                    query: { category: "store" },
                    columns: {
                        storeName: { label: "Store name", className: "field-name", },
                        timestamp: { label: "Last change", className: "field-timestamp", formatter: DateFormatter, },
                        storeSize: { label: "Size", className: "field-value", },
                        add: { label: "Add", className: "field-value", },
                        update: { label: "Update", className: "field-value", },
                        remove: { label: "Remove", className: "field-value", },
                    },
                });
                storeGrid.set("sort", "storeName", false);
                

                var socketGrid = new Grid({
                    id:"SocketGrid_" + this.uid,
                    store: DiagnosticsStore,
                    query: { category: "socket" },
                    columns: {
                        channel: { label: "Channel name", className: "field-name", },
                        timestamp: { label: "Last status change", className: "field-timestamp", formatter: DateFormatter, },
                        status: { label: "Status", className: "field-value", },
                        lastMessage: { label: "Last message", className: "field-timestamp", formatter: DateFormatter, },
                        in: { label: "Messages in", className: "field-value", },
                        out: { label: "Messages out", className: "field-value", },
                        source: { label: "Source", className: "field-value", },
                        error: { label: "Description", className: "field-value", },
                    },
                });
                socketGrid.set("sort", "channel", false);

                var xhrGrid = new Grid({
                    id:"xhrGrid_" + this.uid,
                    store: DiagnosticsStore,
                    query: { category: "xhr" },
                    columns: {
                        url: { label: "Request URL", className: "field-name", },
                        method: { label: "Method", className: "field-value" },
                        status: { label: "Status", className: "field-value", renderCell: StatusFormatter, },
                        out: { label: "Requests out", className: "field-value", },
                        lastRequest: { label: "Last Request", className: "field-timestamp", formatter: DateFormatter, },
                        success: { label: "Successful Requests", className: "field-value" },
                        lastSuccess: { label: "Last Success", className: "field-timestamp", formatter: DateFormatter, },
                        failure: { label: "Failed Requests", className: "field-value" },
                        lastFailure: { label: "Last Failure", className: "field-timestamp", formatter: DateFormatter, },
                    },
                });
                xhrGrid.set("sort", "method", false);
                xhrGrid.set("sort", "url", false);

                this.tabContainer = new TabContainer({ "class": this.styleOuter});
                this.tabContainer.addChild(this.prepareGrid(storeGrid, "Stores", "StoresPane_" + this.uid));
                this.tabContainer.addChild(this.prepareGrid(socketGrid, "Sockets", "SocketsPane_" + this.uid));
                this.tabContainer.addChild(this.prepareGrid(xhrGrid, "Ajax Requests", "xhrPane_" + this.uid));

                return this.tabContainer;
            },

            startup: function() {
                    this.tabContainer.startup();
                },

            prepareGrid: function(grid, title,id) {
                var contentPane = new ContentPane({ id:id,title: title, content: grid.domNode });
                contentPane.on("show", function() {
                    grid.set("showHeader", true);
                });
                return contentPane;
            },

            restyleGrids:function(){
                var grids = ["StoreGrid","SocketGrid","xhrGrid"];
                var panes = ["StoresPane", "SocketsPane","xhrPane"];
                for(var i = 0; i < grids.length; i++){
                	var grid = document.getElementById(grids[i] + "_" + this.uid);
                	if (grid != null){
                		grid.style.width = "100%";
                		grid.style.height = "100%";
                        
                        // Removing width from "table" rows container, otherwise
						// "table" cells aren't properly aligned with their
						// headers
                        var gridcontents = grid.getElementsByClassName("dgrid-content");
                        if (gridcontents.length > 0 && gridcontents[0] != null){
                        	gridcontents[0].style.width = "";
                        }
                	}                	
                    var pane = document.getElementById(panes[i] + "_" + this.uid);
                    if (pane != null) {
                    	pane.style.overflow = "hidden";
                    }      
                }        
              
               
            }
            
        });
    });
    



    