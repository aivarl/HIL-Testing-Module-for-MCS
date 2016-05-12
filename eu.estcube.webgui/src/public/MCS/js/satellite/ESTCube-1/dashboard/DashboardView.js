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
        "common/display/GenericContentProvider", 
        "common/display/GridContentProvider", 
        "common/display/ListContentProvider", 
        "common/display/CompositeContentProvider", 
        "common/display/GaugeContentProvider", 
        "common/display/DGridTooltipSupport", 
        "common/display/Ax25UiFramesContentProvider", 
        "common/display/WebCamContentProvider", 
        "common/display/CommandsContentProvider", 
        "common/display/TelemetryContentProvider",             
        "dojo/dom-style",
        "common/display/BdsContentProvider", 
        "common/store/TelemetryQuery",
        "dojo/_base/lang",
        "common/display/FrameStatisticsContentProvider",
        ], 
        function(declare, DomClass, DomConstruct, Config, DateFormatter, NameFromIdFormatter, BusinessCardStore, PageStore, WebCamStore, ParameterStore, MissionInformationStore, Dashboard, GenericContentProvider, GridContentProvider, ListContentProvider, CompositeContentProvider, GaugeContentProvider, DGridTooltipSupport, Ax25UiFramesContentProvider, WebCamContentProvider, CommandsContentProvider, TelemetryContentProvider, domStyle,BdsContentProvider,TelemetryQuery,Lang,FrameStatisticsContentProvider) {
            return declare([], {
                constructor: function (args) {
                	this.groundStation = MissionInformationStore.getGroundStation();
                    var config = [{
                        title: "Send Commands through " + this.groundStation.name,
                        contentProvider: new CommandsContentProvider(),
                    }, {
                        title: "BDS",
                        contentProvider: new BdsContentProvider(),
                    }, {
                        title: "ADCS",
                        contentProvider: new TelemetryContentProvider({
                            query: Lang.partial(TelemetryQuery, ["CDHS"], ["timestamp", "art1", "art2", "g3t1", "g3t4", "g3t3", "g3t2", "g3t1", "at2", "gt4", "gt3", "gt2"]),
                            name: "ADCS"
                        }),
                    }	, {
                        title: this.groundStation.name + " WebCam",
                        contentProvider: new WebCamContentProvider({
                            store: WebCamStore,
                            imageId: Config.ESTCube1_DASHBOARD.imageId,
                            initialImage: Config.ESTCube1_DASHBOARD.initialImage,
                            width: "100%",
                        }),
                        open: false,
                    }, {
                        title: "EPS info",
                        contentProvider: new TelemetryContentProvider({
                            name: "EPS",
                            query: Lang.partial(TelemetryQuery, ["EPS"], ["mode", "resetcount", "version", "bdstime", "counter", "bat_a", "bat_b", "mpb_ext1280", "ctl_adcs_cs", "ctl_cam_3v3_cs", "ctl_cdhs_a_cs", "ctl_cdhs_b_cs", "ctl_cdhs_bsw_cs", "ctl_com_cs", "ctl_com_cs", "ctl_pl_3v3_cs", "ctl_pl_5v_cs", "ctl_pl_12v_cs"])
                        }),
                    }, {
                        title: "CDHS",
                        contentProvider: new TelemetryContentProvider({
                            name: "CDHS",
                            query: Lang.partial(TelemetryQuery, ["CDHS"], ["timestamp", "version", "errors", "resets", "heap", "cmds", "packets", "core_temp", "rtc_temp", "fw_id", "num_resets", "num_errors", "num_cmds", "vref", "mcu_temp", "rtc_temp"])
                        }),
                    }, {
                        title: "Frames (uplink = black, downlink = blue)",
                        contentProvider: new Ax25UiFramesContentProvider(),
                    }, {
                    	title: "AX.25 frame statistics",
                    	contentProvider: new FrameStatisticsContentProvider(),
                    	open: true,
                    }, {
                        title: "Telemetry",
                        contentProvider: new TelemetryContentProvider({
                            name: "Telemetry"
                        }),
                    }];
                    this.dashboard = new Dashboard({
                        config: config,
                        columns: Config.DASHBOARD.numberOfColumns,
                    });
                    DomClass.add(this.dashboard.getContainer().domNode, "fill");
                },

                placeAt: function (container) {
                    this.dashboard.placeAt(container);
                },
            });
        });