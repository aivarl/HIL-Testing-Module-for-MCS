define([
        "dojo/_base/declare",
        "dojo/dom-construct",
        "config/config",
        "common/store/MissionInformationStore",
        "common/store/WebCamStore",
        "common/display/WebCamContentProvider"
        ],

    function(declare, DomConstruct, Config, MissionInformationStore, store, WebCamContentProvider) {
        return declare([], {

            constructor: function(args) {
            	this.groundStation = MissionInformationStore.getGroundStation();
                this.provider = new WebCamContentProvider({
                    store: store,
                    initialImage: Config.ES5EC_WEBCAM.initialImage,
                    imageId: Config.ES5EC_WEBCAM.imageId,

                });
            },
            placeAt: function(container) {
                this.provider.getContent().placeAt(container);
            },

        });
    });
