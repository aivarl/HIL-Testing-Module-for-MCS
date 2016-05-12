define([
    "dojo/domReady!"
    ],

    function(ready) {

        return {
            routes: {
                GS_ANTENNA: {
                    path: "GS/antenna",
                    defaults: {
                        controller: "GSAntenna/AntennaController",
                        method: "index",
                    }
                },
            },

            ANTENNA: {
              canvasWidth: 640,
              canvasHeight: 480
            }

        };
    }
);