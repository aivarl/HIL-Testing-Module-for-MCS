define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                ESTCube1_Beacon: {
                    path: "ESTCube-1/beacon",
                    defaults: {
                        controller: "ESTCube-1.beacon/BeaconController",
                        method: "index",
                    }
                },
            },

            BEACON: {
                CHECK_URL: "/translateRadioBeacon",
                SUBMIT_URL: "/radioBeacon",
                prefix: "/ESTCUBE/Satellites/ESTCube-1/beacon/",
                specialParameters: {
                    string: "/ESTCUBE/Satellites/ESTCube-1/beacon/string",
                    operatingMode: "/ESTCUBE/Satellites/ESTCube-1/beacon/operating.mode",
                }
            }

        };
    }
);
