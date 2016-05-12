define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dijit/registry",
    "dojox/layout/GridContainer",
    "dojox/widget/Portlet",
    "dojox/widget/PortletSettings",
    "dijit/form/Button",
    "./ContentProvider",
    ],

    function(declare, Arrays, Registry, GridContainer, Portlet, PortletSettings, Button, Provider) {
        return declare([], {

                constructor: function(args) {
                    declare.safeMixin(this, args);
                    this.gridContainer = new dojox.layout.GridContainer({
                            nbZones: this.columns,
                            opacity: .20,
                             minColWidth: "1%",
                            hasResizableColumns: false,
                            allowAutoScroll: false,
                            withHandles: true,
                            dragHandleClass: "dijitTitlePaneTitle",
                            acceptTypes: ["Portlet"],
                            isOffset: true,
                            hasResizableColumns:true
                        });
        
                    Arrays.forEach(this.config, function(item, index) {
                    	if(item.open==undefined){
                    		item.open=true;
                    	}
                        var portlet = new dojox.widget.Portlet({
                        		id: item.id,
                            dndType: "Portlet",
                            title: item.title,
                            closable: item.closable,
                            open: item.open,
                            isLayoutContainer: true
                        });

                        if (item.settings != null) {
                            var settings = new dojox.widget.PortletSettings({ innerHTML: item.settings });
                            portlet.addChild(settings);
                        }

                        var provider = item.contentProvider == null ? new ContentProvider() : item.contentProvider;
                        var content = provider.getContent();
                        portlet.addChild(content);
                        if (item.col != null && item.row != null) {
                            this.gridContainer.addChild(portlet, item.col, item.row);
                        } else {
                            this.gridContainer.addChild(portlet);
                        } 
                        provider.initialize();
                    }, this);
                },
                
                placeAt: function(container) {
                    this.gridContainer.placeAt(container);
                    this.gridContainer.startup();
                },

                getContainer: function() {
                    return this.gridContainer;
                }
            });
    }
);

