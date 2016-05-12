define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                ESTCube1_TLE: {
                    path: "ESTCube-1/tle",
                    defaults: {
                        controller: "ESTCube-1.tle/TleController",
                        method: "index",
                    }
                },
            },

            TLE: {
                SATELLITE_ID: "/ESTCUBE/Satellites/ESTCube-1",
                TOPIC_TLE_SUBMIT: "tle/submit",
                URL_TLE_SUBMIT: "/tle/submit",
                URL_TLE_QUERY: "/tle",
            }

        };
    }
);
