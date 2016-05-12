define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                DIAGNOSTICS: {
                    path: "system/diagnostics",
                    defaults: {
                        controller: "Diagnostics/DiagnosticsController",
                        method: "index",
                    }
                },
            },

            DIAGNOSTICS: {
            }

        };
    }
);
