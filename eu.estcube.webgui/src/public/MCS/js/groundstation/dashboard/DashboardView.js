define([
        "dojo/_base/declare", 
        "dojo/dom-class", 
        "dojo/dom-construct",
        "config/config",
        "common/formatter/DateFormatter",
        "common/formatter/NameFromIdFormatter", 
        "common/store/BusinessCardStore", 
        "common/store/PageStore", 
        "common/store/WebCamStore", 
        "common/store/ParameterStore", 
        "common/store/MissionInformationStore", 
        "common/display/Dashboard", 
        "common/display/WebCamContentProvider",      
        "common/display/RadarViewContentProvider",  
        "dojo/dom-style",
        "common/display/BdsContentProvider", 
        "common/store/TelemetryQuery",
        "dojo/_base/lang",
        "common/display/FrameStatisticsContentProvider",
        "common/display/ContactContentProvider",
      "common/display/WeatherContentProvider"
        ], 
        function(declare, DomClass, DomConstruct, Config, DateFormatter, NameFromIdFormatter, BusinessCardStore, PageStore, WebCamStore, ParameterStore, MissionInformationStore, Dashboard, WebCamContentProvider,RadarViewContentProvider, domStyle,BdsContentProvider,TelemetryQuery,Lang,FrameStatisticsContentProvider,ContactContentProvider,WeatherContentProvider) {
            return declare([], {
                constructor: function (args) {
                	this.groundStation = MissionInformationStore.getGroundStation();
                    this.radarViewId = "sysDashboardRadar";
                    this.radarViewContentProvider = RadarViewContentProvider({
                            id: this.radarViewId
                                });

                    var config = [
                    {
                        title: this.groundStation.name + " Radar View",
                        contentProvider:this.radarViewContentProvider,
                        open: true,
                    },
                    {
                        title: this.groundStation.name + " WebCam",
                        contentProvider: new WebCamContentProvider({
                            store: WebCamStore,
                            imageId: Config.ESTCube1_DASHBOARD.imageId,
                            initialImage: Config.ESTCube1_DASHBOARD.initialImage,
                            width: "100%",
                        }),
                        open: false,
                    }, 
                    {
                        title: this.groundStation.name + " Contacts",
                        contentProvider:new ContactContentProvider(this.groundStation.ID),
                        open: true,
                    },

                    {
                        title: "Weather Information at " + this.groundStation.name,
                        contentProvider:new WeatherContentProvider(),
                        open: true,
                    }

                    ];
                    this.dashboard = new Dashboard({
                        config: config,
                        columns: Config.DASHBOARD.numberOfColumns,
                    });
                    DomClass.add(this.dashboard.getContainer().domNode, "fill");
                },

                placeAt: function (container) {
                    this.dashboard.placeAt(container);
                    
                    this.radarViewContentProvider.restyleRadarView();
                    this.radarViewContentProvider.getPositionOfElementInAPage(this.radarViewId);
                    this.radarViewContentProvider.getFirstContactData();
                },
            });
        });