define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                DEMO: {
                    path: "system/demo",
                    defaults: {
                        controller: "Demo/DemoController",
                        method: "index",
                    }
                },
            },

            DEMO: {
                buttonLabel: "Hit me!",
                buttonTooltip: "Go ahead and press me!",
                message: "ohoo",
            }

        };
    }
);
