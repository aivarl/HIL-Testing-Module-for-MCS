define([
    "dojo/_base/declare", 
    "dojo/_base/lang", 
    "dojo/_base/array", 
    "dojo/aspect", 
    "dojo/dom-class",
    "dijit/Dialog",
    "dgrid/OnDemandGrid", 
    "dgrid/util/misc", 
    "common/store/SystemLogStore", 
    "common/formatter/DateFormatter", 
    "common/formatter/TelemetryFormatter", 
    "common/display/ObjectToDiv",
    "./ContentProvider"
    ],

    function(declare, Lang, Arrays, Aspect, DomClass, Dialog, Grid, Misc, store,
             DateFormatter, TelemetryFormatter, ObjectToDiv, ContentProvider) {

        return declare(ContentProvider, {  
            store:store,               
            getContent: function () {
                this.grid = new Grid({
                    store: this.store,
                    columns: {
                        issuedBy: { label: "Name", className: "field-issuedBy", },
                        level: { 
                            label: "Level",
                            className: "field-level",
                            renderCell: function(object, value, node, options) {
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
                        timestamp: { label: "Time", formatter: DateFormatter, className: "field-timestamp", },
                    }
                });

                this.grid.set("sort", "timestamp", true);
                var dialog = new Dialog({
                    title: "Log Entry Details",
                    style: "width: 800px; background-color: #ffffff",
                });

                this.grid.on("dblclick", Lang.hitch(this, function(event) {
                    var source = event.srcElement;
                    var row = this.grid.row(source);
                    if (row) {
                        dialog.set("content", ObjectToDiv.toDiv(row.data, {
//                            title: "Details",
                            titleClass: "details-title",
                            labelClass: "details-label",
                            valueClass: "details-value",
                            rows: {
                                timestamp: { label: "Timestamp", formatter: DateFormatter },
                                issuedBy: { label: "Component Name", formatter: function(item) {
                                    return item ? "Unknown" : item;
                                }},
                                level: { label: "Level", },
                                value: { label: "Message", },
                                logger: { label: "Logger", },
                                thread: { label: "Thread", },
                                throwable: { label: "Exception", },
                            },

                        }));
                        dialog.show();
                    }
                }));
                setTimeout(Lang.hitch(this, function() { this.grid.set("showHeader", true) }), 500);
            
                return this.grid;
            },

            startup: function() {
                    this.grid.startup();
                },
        });
    });