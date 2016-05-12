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
    "common/display/WebCamContentProvider",
    "common/display/CompositeContentProvider",
    "common/display/GaugeContentProvider",
    "common/display/DGridTooltipSupport",
    "common/display/ContactContentProvider",
    "common/display/LogContentProvider",
    "common/formatter/StatusFormatter",
    "common/display/SystemMessageContentProvider",
    "common/display/DiagnosticsContentProvider",
    "dojo/_base/lang", 
    ],

    function(declare, DomClass, DomConstruct, Config, DateFormatter, NameFromIdFormatter,
        BusinessCardStore, PageStore, WebCamStore, ParameterStore, MissionInformationStore,
        Dashboard, GenericContentProvider, GridContentProvider, ListContentProvider, WebCamContentProvider, CompositeContentProvider, GaugeContentProvider, DGridTooltipSupport, ContactContentProvider,LogContentProvider,StatusFormatter,SystemMessageContentProvider,DiagnosticsContentProvider,lang) {

        return declare([], {

            constructor: function(args) {
                var config = [
                    {
                        title: "Components",
                        settings: "MCS Components.",
                        contentProvider: new GridContentProvider({
                            columns: {
                                name: { label: "Name", className: "field-issuedBy" },
                                host: { label: "Host", className: "field-host" },
                                status: { label: "Status", className: "field-status", renderCell: StatusFormatter, },
                                timestamp: { label: "Time", formatter: DateFormatter, className: "field-timestamp" },
                            },
                            store: BusinessCardStore,
                            onStartup: function(provider) {
                                new DGridTooltipSupport(provider.grid, function(entry) {
                                    return entry.description;
                                });
                            },
                        }),
                        col: 0,
                        row: 0,
                    },

                    {
                        title: "Host stats",
                        settings: "System recources monitoring.",
                        contentProvider: new GridContentProvider({
                            columns: {
                                name: { label: "Name", className: "field-short-name", formatter: NameFromIdFormatter },
                                value: { label: "Value", className: "field-medium-value" },
                                unit: { label: "Unit", className: "field-long-unit" },
                            },
                            store: ParameterStore,
                            order: "name",
                            query: function(message) {
                                return /^Host\/.*/.test(message.name);
                            },
                            onStartup: function(provider) {
                                new DGridTooltipSupport(provider.grid, function(entry) {
                                    return entry.description;
                                });
                            },
                        }),
                        col: 1,
                        row: 0,
                    },

                     {
                        title: "System log",
                        settings: "LogContentProvider",
                        contentProvider: new LogContentProvider(),
                        col: 2,
                        row: 0,
                    },
                   
                ];

                this.diagnosticsContentProvider = new DiagnosticsContentProvider({styleInner:""});
                this.dashboard = new Dashboard({ config: config, columns: Config.DASHBOARD.numberOfColumns });
                DomClass.add(this.dashboard.getContainer().domNode, "fill-system-dashboard");
                config = [

                  {
                        title: "UI diagnostics",
                        settings: "UI diagnostics",
                        contentProvider: this.diagnosticsContentProvider,
                        col: 0,
                        row: 1,
                    },


                    {
                        title: "System Messages",
                        settings: "System Messages",
                        contentProvider: new SystemMessageContentProvider(),
                        col: 0,
                        row: 1,
                    },
 
                   
                ];

                this.dashboardSecond = new Dashboard({ config: config, columns: 2});
                DomClass.add(this.dashboardSecond.getContainer().domNode, "fill-system-dashboard-second");
            },

            placeAt: function(container) {
                this.dashboard.placeAt(container);
                this.dashboardSecond.placeAt(container);
                this.diagnosticsContentProvider.restyleGrids();

            },
            
        });
    }
);
