define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dojo/dom-geometry",
    "dojo/request",
    "dojo/topic",
    "dojo/data/ObjectStore",
    "dojox/widget/Standby",
    "dijit/Dialog",
    "dijit/form/Select",
    "dgrid/OnDemandGrid",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "config/config",
    "common/formatter/DateFormatter",
    "common/store/ParameterStore",
    "common/store/MissionInformationStore",
    "common/store/OrbitalStateStore",
    "common/store/SetParameterLevelColor",
    "common/messages/SystemMessage",
    ],

    function(declare, Lang, DomConstruct, DomClass, DomGeometry, Request, Topic, ObjectStore, Standby,
        Dialog, Select, Grid, TabContainer, ContentPane, Config, DateFormatter, ParameterStore,
        MissionInformationStore, OrbitalStateStore, SetParameterLevelColor, SystemMessage) {

        return declare([], {

            constructor: function(args) {

                // TAB #1
                var parameterGrid = new Grid({
                    store: ParameterStore,
                    query: {},
                    columns: {
                        ID: { label: "ID", className: "field-name" },
                        name: { label: "Name", className: "field-name" },
                        value: { label: "Value", className: "field-medium-value", 
                        	renderCell:function(object,value,node){
                        		node.innerHTML = value;
                            	SetParameterLevelColor(object, node);
                        	}
                        },
                        timestamp: { label: "Timestamp", formatter: DateFormatter, className: "field-timestamp", },
                        issuedBy: { label: "Component Name", className: "field-issuedBy", },
                        class: { label: "Class", className: "field-class" },
                        description: { label: "Description", className: "field-description" },
                    },
                });
                parameterGrid.set("sort", "name", true);

                var dialog = new Dialog({
                    title: "Debug Info",
                    style: "width: 800px; background-color: #ffffff",
                });


                parameterGrid.on("dblclick", function(event) {
                    var source = event.srcElement;
                    var row = parameterGrid.row(source);
                    if (row) {

                        var contentDiv = DomConstruct.create("div", {
                            innerHTML: JSON.stringify(row.data),
                            style: {
                                width: "100%",
                                height: "400px",
                                overflow: "auto",
                                "word-wrap": "break-word",
                            }
                        });

                        dialog.set("content", contentDiv);
                        dialog.show();
                    }
                });

                // TAB #2
                var orbitalStatesGrid = new Grid({
                    noDataMessage: "Loading ...",
                    store: OrbitalStateStore,
                    columns: [
                        { field: "satelliteId", label: "Satellite", className: "field-name", },
                        { field: "timestamp", label: "Timestamp", formatter: DateFormatter, className: "field-timestamp", },
                        { field: "geoLocation", label: "Latitude", formatter: function(gl) { return gl.latitude }, className: "field-medium-value", },
                        { field: "geoLocation", label: "Longitude", formatter: function(gl) { return gl.longitude }, className: "field-medium-value", },
                        { field: "geoLocation", label: "Altitude", formatter: function(gl) { return gl.altitude }, className: "field-medium-value", },
                        { field: "derivedFrom", label: "TLE", className: "field-name", },
                        { field: "generationTime", label: "Generation Time", formatter: DateFormatter, className: "field-timestamp", },
                        { field: "issuedBy", label: "Source", className: "field-issueBy", },
                    ]
                });
                orbitalStatesGrid.set("sort", "timestamp", true);

                var standby = new Standby({ target: orbitalStatesGrid.domNode, centerIndicator: "text", text: "Loading ..." });
                document.body.appendChild(standby.domNode);

                // wrap the MissionInformationStore to dojo/data/ObjectStore to make it suitable for the select widget
                var objectStore = new ObjectStore({ objectStore: MissionInformationStore });

                // TODO: If the MissionInformationStore requests are not finished, this will be empty
                var selectSatellite = new Select({
                    name: "satellite",
                    style: "width: 200px;",
                    store: objectStore,
                    query: { "class": "Satellite" },
                    labelAttr: "name",
                    autoWidth: false,
                    forceWidth: true,
                    maxHeight: -1,
                    onSetStore: function() {
                        // add first element to the select
                        var first = { label: "All satellites", value: null }
                        this.options.unshift(first);
                        this._loadChildren();
                        // set selection to first option
                        this.set("value", first.value);
                        this.set("displayedValue", first.label);
                    },
                    onChange: function(newValue) {
                        // listen changes & skip the first one
                        if (newValue) {
                            orbitalStatesGrid.set("query", {
                                satellite: newValue
                            });
                        }
                    },
                });

                var orbitalStatesGridWrapper = this.prepareGrid(orbitalStatesGrid, "Orbital States");
                var orbitalStatesWrapper = new ContentPane({ title: "Orbital States", "class": "fill" });

                // XXX - 16.04.2013, kimmell - nasty hack to set size of the grid; there has to be better way
                orbitalStatesWrapper.on("show", function() {
                    var box = DomGeometry.getContentBox(orbitalStatesWrapper.domNode);
                    var selectBox = DomGeometry.getContentBox(selectSatellite.domNode);
                    DomGeometry.setContentSize(orbitalStatesGridWrapper.domNode, { w: box.w - box.l * 4, h: box.h - selectBox.h * 3 });
                });

                selectSatellite.placeAt(orbitalStatesWrapper.domNode);
                orbitalStatesGridWrapper.placeAt(orbitalStatesWrapper.domNode);

                // TAB CONTAIER

                this.tabContainer = new TabContainer({ "class": "fill" });
                this.tabContainer.addChild(this.prepareGrid(parameterGrid, "Parameters"));
                this.tabContainer.addChild(orbitalStatesWrapper);

            },

            placeAt: function(container) {
                this.tabContainer.placeAt(container);
                this.tabContainer.startup();
            },

            prepareGrid: function(grid, title) {
                DomClass.add(grid.domNode, "fill");
                var gridPlaceholder = DomConstruct.create("div", { "class": "fill" });
                DomConstruct.place(grid.domNode, gridPlaceholder);

                var contentPane = new ContentPane({ title: title, content: gridPlaceholder });
                // XXX - 14.03.2013, kimmell - fix for dgrid header not visible bug
                contentPane.on("show", function() {
                    grid.set("showHeader", true);
                });

                return contentPane;
            },

        });
    }
);
