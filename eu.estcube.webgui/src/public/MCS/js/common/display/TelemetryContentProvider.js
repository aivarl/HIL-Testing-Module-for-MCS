define([
    "dojo/_base/declare", 
    "dojo/_base/lang", 
    "dojo/_base/array", 
    "dojo/aspect", 
    "dojo/dom-class",
    "dojo/on",
    "dgrid/OnDemandGrid", 
    "dgrid/util/misc", 
    "./ContentProvider", 
    "common/store/ParameterStore", 
    "common/store/SetParameterLevelColor", 
    "common/formatter/DateFormatter", 
    "common/formatter/TelemetryFormatter", 
    ], 
    function(declare, Lang, Arrays, Aspect, DomClass, on, Grid, Misc, ContentProvider, ParameterStore, SetParameterLevelColor, DateFormatter,TelemetryFormatter) {
        return declare(ContentProvider, {        
            grid: null,
            store: ParameterStore,
            lookupStore: ParameterStore,          
            getContent: function (args) {
                declare.safeMixin(this, args);
                this.grid = new Grid({
                    id: this.id,
                    class: this.domClasses,
                    columns: this.columns || {
                        timestamp: {
                            label: "Timestamp",
                            className: "field-telemetry-timestamp",
                            formatter: DateFormatter,
                        },
                        name: {
                            label: "Name",
                            className: "field-telemetry-name",
                        },
                        description: {
                            label: "Description",
                            className: "field-telemetry-description",
                        },
                        value: {
                            label: "Value",
                            className: "field-telemetry-value",
                            renderCell: function (object, value, node, options) {
                                node.innerHTML = TelemetryFormatter(object);
                                SetParameterLevelColor(object, node);
                            }
                        },
                        unit: {
                            label: "Unit",
                            className: "field-telemetry-unit",
                        },
                    },
                    store: this.store,
                    query: this.query ||

                    function (message) {
                        return /\/.*\/Satellites\/.*\/.*/.test(message.ID) &&
                            message["class"] != "Metadata";
                        return true;
                    }

                });
                
                setTimeout(Lang.hitch(this, function () {
                    this.grid.set("showHeader", true), this.grid.set("sort", "timestamp", true)
                }), 1);

                on( this.grid, 'show', this.grid.resize() );
                return this.grid;
            },

            startup: function() {
                    this.grid.startup();
                },
            
        });
    });
    



