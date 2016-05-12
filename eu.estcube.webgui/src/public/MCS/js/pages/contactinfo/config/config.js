define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                CONTACTINFO_EN: {
                    path: "pages/contactinfo/en",
                    defaults: {
                        controller: "Contactinfo/ContactInfoControllerEn",
                        method: "index",
                    }
                },
                CONTACTINFO_ET: {
                    path: "pages/contactinfo/et",
                    defaults: {
                        controller: "Contactinfo/ContactInfoControllerEt",
                        method: "index",
                    }
                },
            },
            CONTACTINFO_SETTINGS: {
            	groundStationId: "/ESTCUBE/GroundStations/ES5EC"
            },
            CONTACTINFO_SLANGUAGE_EN: {
            	SATGS: "ESTCube-1 (Tartu Observatory GS)",
            	UTC: "UTC",
            	MET: "MET"
            },
            CONTACTINFO_SLANGUAGE_ET: {
            	SATGS: "ESTCube-1 (Tartu Observatoorium)",
            	UTC: "Maailmaaeg",
            	MET: "Aeg stardist"
            }
        };
    }
);
