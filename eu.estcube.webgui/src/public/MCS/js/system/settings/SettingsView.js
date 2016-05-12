define([
    "dojo/_base/declare",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/Stateful",
    "config/config",
    "common/store/WebCamStore",
    "common/display/Dashboard",
    "common/display/AudioContentProvider",
    "common/display/Ax25UiFramesContentProvider",
    ],

    function(declare, DomClass, DomConstruct, Stateful, Config, WebCamStore, Dashboard, 
            AudioContentProvider, Ax25UiFramesContentProvider) {

        return declare([], {

            constructor: function(args) {

                var audio = new AudioContentProvider({
                    id: "settingsPortlet", 
                    vertical: false, 
                    style1: "", 
                    style2: "", 
                });

                var config = [{
                    title: "Audio Settings",
                    contentProvider: audio,
                    col: 0,    //Specifies the position on the dashboard
                    row: 0
                }];

                this.dashboard = new Dashboard({ config: config, columns: Config.DASHBOARD.numberOfColumns });
                DomClass.add(this.dashboard.getContainer().domNode, "fill");
            },

            placeAt: function(container) {
                this.dashboard.placeAt(container);
            }
        });
    }
);
