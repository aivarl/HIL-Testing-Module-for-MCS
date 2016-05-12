define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dijit/popup",
    "dijit/TooltipDialog",
    "config/config",
    "common/formatter/DateFormatter",
    "common/store/ParameterStore",
    "common/store/MissionInformationStore", 
    "common/store/SetParameterLevelColor",
    "common/display/Dashboard",
    "common/display/GridContentProvider",
    "common/display/DGridTooltipSupport"
    ],

    function(declare, Arrays, DomClass, DomConstruct, Popup, TooltipDialog, Config, DateFormatter, ParameterStore, MissionInformationStore, SetParameterLevelColor, Dashboard, GridContentProvider, DGridTooltipSupport) {

        function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        return declare([], {

            constructor: function(args) {
            	this.groundStation = MissionInformationStore.getGroundStation();
            	// TODO weather data should be in base
                var config = [
                    this.createProvider("/ESTCUBE/WeatherStations/meteo.physic.ut.ee", "meteo.physic.ut.ee"),
                    this.createProvider("/ESTCUBE/WeatherStations/emhi.ee", "emhi.ee"),
                    this.createProvider("/ESTCUBE/WeatherStations/ilm.ee", "ilm.ee"),
                ];
                this.dashboard = new Dashboard({ config: config, columns: Config.GS_WEATHER.numberOfColumns });
                DomClass.add(this.dashboard.getContainer().domNode, "fill");
            },

            placeAt: function(container) {
                this.dashboard.placeAt(container);
            },

            createProvider: function(source, title) {
                var provider = new GridContentProvider({
                    columns: {
                        name: { label: "Name", className: "field-short-name" },
                        value: { label: "Value",
                                renderCell:function(object,value,node){
                                    var res = value;
                                    if(object.applicableTo.indexOf("ilm.ee")!=-1 && object.name === "Air Pressure"){
                                        res = parseInt(res) * 1.3332239;
                                    }
                                    if (res == undefined) {
                                        res = "";
                                    } else if (!isNaN(parseFloat(res)) && isFinite(res)) {
                                        // round decimals to two places on only decimal values
                                        // Check if value is decimal
                                        if (res % 1 != 0) {
                                            res = res.toFixed(2);
                                        }
                                    }
                                    node.innerHTML = res;
                                    SetParameterLevelColor(object, node);
                                }
                        },
                        unit: { 
                            label: "Unit",
                            renderCell:function(object,value,node){
                                if(value!= undefined){
                                    var res = value;
                                    if(value.indexOf("^2")!=-1){
                                        var res = value.replace("^2"," &#178");
                                    }
                                    node.innerHTML = res;
                                }
                            }
                        },
                        timestamp: { label: "Time", formatter: DateFormatter },
                    },
                    store: ParameterStore,
                    query: function(message) {
                        return source == message.applicableTo;
                    },
                    orderBy: "name",
                    sortOrder: "ASC",
                    onStartup: function(provider) {
                        new DGridTooltipSupport(provider.grid, function(entry) {
                            return entry.description;
                        });
                    },
                });

                return {
                        title: title,
                        contentProvider: provider,
                };
            }

        });
    }
);
