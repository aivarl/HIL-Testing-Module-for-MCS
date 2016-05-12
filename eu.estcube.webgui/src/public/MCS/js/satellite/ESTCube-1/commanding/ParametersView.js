define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dijit/Dialog",
    "dgrid/OnDemandGrid",
    "config/config",
    "common/formatter/DateFormatter",
    "common/store/EstCube1CommandingParametersStore",
    "common/store/SetParameterLevelColor",
    "common/display/ObjectToDiv",
    "common/formatter/TelemetryFormatter", 
    ],

    function(declare, Lang, DomConstruct, DomClass, Dialog, Grid, config, DateFormatter, store, SetParameterLevelColor, ObjectToDiv,TelemetryFormatter) {
        return declare([], {
            constructor: function(args) {
                this.grid = new Grid({
                    id:"parametersView",
                    store: store,
                    columns: {
                        timestamp: { 
                            label: "Timestamp", 
                            formatter: DateFormatter, 
                            className: "field-timestamp", },
                        name: { 
                            label: "Name", 
                            className: "field-description", },
                        value: { 
                            label: "Value", 
                            className: "field-value",
                            renderCell: function (object, value, node, options) {
                                node.innerHTML = TelemetryFormatter(object);  
                                SetParameterLevelColor(object, node);                           
                            }
                            },
                        issuedBy: { 
                            label: "Issued by", 
                            className: "field-issuedBy", },  
                        unit: { 
                            label: "Unit", 
                            className: "field-unit", },

                    }
                });
                DomClass.add(this.grid.domNode, "fill-parameters");
                this.grid.set("sort", "timestamp", true);
               

                this.grid.startup();
                setTimeout(Lang.hitch(this, function() { this.grid.set("showHeader", true) }), 500);
            },

               placeAt: function(container) {
                DomConstruct.place(this.grid.domNode, container);
                
                var axBcHeight=  ax25ViewPane.scrollHeight;
                ax25ViewPane.style.height=axBcHeight+"px";    

                var mainContainer = document.getElementById("parametersView");       
                var axBcHeight=  mainContainer.scrollHeight;
                mainContainer.style.height=axBcHeight -14 +"px";  
               
            },

        });
    }
);
