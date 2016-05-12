define([
    "dojo/domReady!"
    ],

    function(ready) {

        return {
            routes: {
            	GS_DASHBOARD: {
                    path: "GS/dashboard",
                    defaults: {
                        controller: "GSDashboard/DashboardController",
                        method: "index",
                    }
                },
            },


        };
    }
);