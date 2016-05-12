define([
    "dojo/dom",
    "dojo/domReady!"
    ],

    function(dom) {
        return {
            routes: {
                SYSTEM_COMPONENTS: {
                    path: "system/components",
                    defaults: {
                        controller: "SystemComponents/ComponentsController",
                        method: "index",
                    }
                },
            },

            SYSETM_COMPONENTS: {
                STATUS_CHECK_INTERVAL: 3000,
            }

        };
    }
);
