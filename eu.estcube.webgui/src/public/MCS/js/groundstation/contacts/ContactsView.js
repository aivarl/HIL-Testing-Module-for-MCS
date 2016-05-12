define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-class",
    "config/config",
    "common/formatter/DateFormatter",
    "common/store/MissionInformationStore",
    "common/store/ResolveById",
    "common/display/ContactContentProvider",
    "common/formatter/TimeDiffFormatter",
    "common/formatter/DoubleFormatter",
    "common/TimeFactory",
    ],

    function(declare, Lang, DomConstruct, DomClass, config, DateFormatter,
             MissionInformationStore, ResolveById, ContactContentProvider,
             TimeDiffFormatter, DoubleFormatter, TimeFactory) {

        return declare([], {

            constructor: function(args) {
            	this.groundStation = MissionInformationStore.getGroundStation();
                var provider = new ContactContentProvider(this.groundStation.ID, {
                    columns: {
                        groundStationId: {
                            label: "Ground Station",
                            className: "field-groundStation",
                            renderCell: function(object, value, node, options) {
                                ResolveById(value, node, provider.lookupStore);
                            },
                        },
                        satelliteId: {
                            label: "Satellite",
                            className: "field-satellite",
                            renderCell: function(object, value, node, options) {
                                ResolveById(value, node, provider.lookupStore);
                            },
                        },
                        orbitNumber: { label: "Orbit", className: "field-unit", },
                        startTime: { label: "Start Time", className: "field-timestamp", formatter: DateFormatter },
                        endTime: { label: "End Time", className: "field-timestamp", formatter: DateFormatter },
                        duration: {
                            label: "Duration",
                            className: "field-duration",
                            renderCell: function(object, value, node, options) {
                                node.innerHTML = TimeDiffFormatter(object.startTime, object.endTime);
                            },
                            sortBy: function(object) {
                                return object.endTime - object.startTime; 
                            }
                        },
                        elevation: {
                            label: "Max Elevation",
                            renderCell: function(object, value, node, options) {
                                node.innerHTML = object.elevation ? DoubleFormatter(object.elevation.max) : config.VALUE_UNKNOWN;
                            },
                            sortBy: function(object) {
                                return object.elevation ? object.elevation.max : config.VALUE_UNKNOWN; 
                            }
                        },
                        azimuthStart: {
                            label: "Start Azimuth",
                            className: "field-short-numeric",
                            renderCell: function(object, value, node, options) {
                                node.innerHTML = object.azimuth ? DoubleFormatter(object.azimuth.start) : config.VALUE_UNKNOWN;
                            },
                            sortBy: function(object) {
                                return object.azimuth ? object.azimuth.start : config.VALUE_UNKNOWN; 
                            }
                        },
                        azimuthEnd: {
                            label: "End Azimuth",
                            className: "field-short-numeric",
                            renderCell: function(object, value, node, options) {
                                node.innerHTML = object.azimuth ? DoubleFormatter(object.azimuth.end) : config.VALUE_UNKNOWN;
                            },
                            sortBy: function(object) {
                                return object.azimuth ? object.azimuth.end : config.VALUE_UNKNOWN; 
                            }
                        },
                        inSunLigth: { label: "In Sun Light", className: "field-unit" },
                        derivedFromId: { label: "Source", className: "field-name" },
                    },
                });
                this.grid = provider.getContent();
                DomClass.add(this.grid.domNode, "fill");

                var gridR = this.grid; // TODO - 02.08.2013, kimmell - use Lang.hitch instead
                var counter = 0;
                TimeFactory.addListener (['aosLosInterval'], this, function(eventName, eventTime) {
                    if (eventTime >= 0) {
                        var eventTimeInSeconds = Math.round(eventTime / 1000.0);
                        if ((counter - eventTimeInSeconds) < 0) {
                            gridR.refresh();
                        }
                        counter = eventTimeInSeconds;
                    }
                });

                // XXX - workaround for grid titles not visible bug
                setTimeout(Lang.hitch(this, function() { this.grid.set("showHeader", true) }), 500);
            },

            placeAt: function(container) {
                DomConstruct.place(this.grid.domNode, container)
            },

        });
    }
);
