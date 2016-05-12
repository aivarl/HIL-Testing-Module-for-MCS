define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
            	ESTCube1_TELEMETRY: {
                    path: "ESTCube-1/telemetry",
                    defaults: {
                        controller: "ESTCube-1.telemetry/TelemetryController",
                        method: "index",
                    }
                },
            },

            ESTCube1_DASHBOARD: {
                numberOfColumns: 2,
            }

        };
    }
);
