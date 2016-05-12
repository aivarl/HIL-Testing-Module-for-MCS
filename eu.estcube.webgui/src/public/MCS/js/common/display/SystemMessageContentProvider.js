define([
    "dojo/_base/declare", 
    "dojo/_base/lang", 
    "dojo/_base/array", 
    "dojo/aspect", 
    "dojo/dom-class", 
    "dgrid/OnDemandGrid", 
    "dgrid/util/misc", 
    "./ContentProvider", 
    "common/store/SystemMessageStore",
    "common/formatter/DateFormatter", 
    ], 
    function(declare, Lang, Arrays, Aspect, DomClass, Grid, Misc, ContentProvider, store, DateFormatter) {
        return declare(ContentProvider, {  
            store:store,               
            getContent: function () {
                this.grid = new Grid({
                    store: store,
                    query: {},
                    columns: {
                        issuedBy: { label: "Name", className: "field-issuedBy", },                        
                        level: { label: "Level", className: "field-level", renderCell: function(object, value, node, options) {
                                node.innerHTML = value;
                                if (value == "TRACE" || value == "DEBUG" || value == "INFO") {
                                    DomClass.add(node, "value-ok");
                                }
                                else if (value == "WARN") {
                                    DomClass.add(node, "value-warning");
                                }
                                else {
                                    DomClass.add(node, "value-error");
                                }
                        }},
                        value: { label: "Message", className: "field-value", },
                         timestamp: { label: "timestamp", formatter: DateFormatter, className: "field-timestamp", },
                    },
                });

                setTimeout(Lang.hitch(this, function () {
                    this.grid.set("showHeader", true), this.grid.set("sort", "timestamp", true)
                }), 500);
    
                return this.grid;
            },

            startup: function() {
                    this.grid.startup();
                },

            
        });
    });
    



