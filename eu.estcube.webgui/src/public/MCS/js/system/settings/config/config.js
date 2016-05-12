define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                SETTINGS: {
                    path: "system/settings",
                    defaults: {
                        controller: "Settings/SettingsController",
                        method: "index",
                    }
                },
            },
        };
    }
);
