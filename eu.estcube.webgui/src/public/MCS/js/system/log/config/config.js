define([
    "dojo/dom",
    "dojo/domReady!"
    ],

    function(dom) {
        return {
            routes: {
                SYSTEM_LOG: {
                    path: "system/log",
                    defaults: {
                        controller: "SystemLog/LogController",
                        method: "index",
                    }
                },
            },

            SYSETM_LOG: {
            }

        };
    }
);
