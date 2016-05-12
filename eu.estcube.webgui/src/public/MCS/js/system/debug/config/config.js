define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                DEBUG: {
                    path: "system/debug",
                    defaults: {
                        controller: "Debug/DebugController",
                        method: "index",
                    }
                },
            },

            DEBUG: {
            }

        };
    }
);
