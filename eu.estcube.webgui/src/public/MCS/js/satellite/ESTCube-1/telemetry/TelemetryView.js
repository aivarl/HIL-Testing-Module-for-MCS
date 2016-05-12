define(["dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/dom-construct",
        "dojo/dom-class",
        "dgrid/OnDemandGrid", 
        "config/config",
        "common/formatter/DateFormatter", 
        "common/store/ParameterStore", 
        "dijit/layout/TabContainer", 
        "dijit/layout/ContentPane",
        "common/display/TelemetryContentProvider", 
        "common/store/TelemetryQuery",
        "./AdcsGridTab",
         ],

    function(declare, Lang, DomConstruct, DomClass, Grid, config, DateFormatter,ParameterStore,TabContainer,ContentPane,TelemetryContentProvider,TelemetryQuery, AdcsGrid) {   
        return declare([], {    
            constructor: function (args) {
                this.tabContainer = new TabContainer({
                    "class": "fill"
                });
                var telemetry = new TelemetryContentProvider({
                    columns: {
                        timestamp: {
                            label: "Timestamp",
                            formatter: DateFormatter,
                            className: "field-timestamp",
                        },
                        name: {
                            label: "ID",
                            className: "field-name",
                        },
                        name: {
                            label: "Name",
                            className: "field-description",
                        },
                        value: {
                            label: "Value",
                            className: "field-value",
                        },
                        unit: {
                            label: "Unit",
                            className: "field-unit"
                        },
                        issuedBy: {
                            label: "Issued by",
                            className: "field-issuedBy",
                        },
                    }
                });
                var cdhsQuery = Lang.partial(TelemetryQuery, ["CDHS"], undefined);
                var cdhs = new TelemetryContentProvider({
                    query: cdhsQuery
                });

                var epsQuery = Lang.partial(TelemetryQuery, ["EPS"], undefined);
                var eps = new TelemetryContentProvider({
                    query: epsQuery
                });

                var comQuery = Lang.partial(TelemetryQuery, ["COM"], undefined);
                var com = new TelemetryContentProvider({
                    query: comQuery
                });

                var camQuery = Lang.partial(TelemetryQuery, ["CAM"], undefined);
                var cam = new TelemetryContentProvider({
                    query: camQuery
                });

                var tcsQuery = Lang.partial(TelemetryQuery, ["TCS"], ["internal_raw", "rtc", "internal", "core_temp", "rtc_temp", "bat_temp_b", "bat_temp_a"]);
                var tcs = new TelemetryContentProvider({
                    query: tcsQuery
                });

                var plQuery = Lang.partial(TelemetryQuery, ["CDHS"], ["egun", "dummy", "timestamp", "tether", "anode", "rtotal", "rtime", "hivolt", "rfeg", "rspeed"]);
                var pl = new TelemetryContentProvider({
                    query: plQuery
                });

                var adcsQuery = Lang.partial(TelemetryQuery, ["CDHS"],
                		["timestamp", "adcs5v", "ctl_adcs_5v", "ctl_adcs_cs",
                		 "g0t", "g1t", "g2t", "g3t", "g4t", "gt0", "gt1", "gt2", "gt3", "gt4", "grt0", "grt1", "grt2", "grt3", "grt4", "at1", "at2", "art1", "art2", "st0", "st1", // temperatures
                		 "s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", // sunsensors
                		 "s12", "s13", "s14", "s15", "s16", "s17", "s18", "s19", "s20", "s21", "s22", "s23", // sunsensors
                		 "g0x", "g0y", "g0z", "g1x", "g1y", "g1z","g2x", "g2y", "g2z", "g3x", "g3y", "g3z", "g4x", "g4y", "g4z", // gyros
                		 "gvx", "gvy", "gvz", // gyro vector
                		 "m0x", "m0y", "m0z", "m1x", "m1y", "m1z", // magnetometers
                		 "resx", "resy", "resz", // torque vector
                		 "ctimestamp", "timeout", "pwm_a", "pwm_b", "pwm_c", "dir_a", "dir_b", "dir_c", "coil_a_cs", "coil_b_cs", "coil_c_cs", // coils
                		 "tether", "anode" // tether
                		 ]);
                var adcs = new TelemetryContentProvider({
                    query: adcsQuery
                });

                var adcsGridTab = new AdcsGrid();

                this.tabContainer.addChild(this.prepareGrid(telemetry.getContent(), "Telemetry"));
                this.tabContainer.addChild(this.prepareGrid(cdhs.getContent(), "CDHS"));


                this.tabContainer.addChild(this.prepareGrid(eps.getContent(), "EPS"));
                this.tabContainer.addChild(this.prepareGrid(com.getContent(), "COM"));
                this.tabContainer.addChild(this.prepareGrid(cam.getContent(), "CAM"));
                this.tabContainer.addChild(this.prepareGrid(tcs.getContent(), "TCS"));
                this.tabContainer.addChild(this.prepareGrid(pl.getContent(), "PL"));
                this.tabContainer.addChild(this.prepareGrid(adcs.getContent(), "ADCS"));
                this.tabContainer.addChild(this.prepareGrid(adcsGridTab.getContent(), "ADCS Grid"));


            },
            placeAt: function (container) {

                this.tabContainer.placeAt(container);
                this.tabContainer.startup();

            },
            prepareGrid: function (grid, title) {
                DomClass.add(grid.domNode, "fill");
                var gridPlaceholder = DomConstruct.create("div", {
                    "class": "fill"
                });

                DomConstruct.place(grid.domNode, gridPlaceholder);
                var contentPane = new ContentPane({
                    title: title,
                    content: gridPlaceholder
                });
                contentPane.on("show", function () {
                    grid.set("showHeader", true);
                });
                return contentPane;
            },
    
        });
    });
