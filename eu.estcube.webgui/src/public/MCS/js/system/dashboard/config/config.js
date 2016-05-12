define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                DASHBOARD: {
                    path: "system/dashboard",
                    defaults: {
                        controller: "Dashboard/DashboardController",
                        method: "index",
                    }
                },
            },

            DASHBOARD: {
                numberOfColumns: 3,
                initialImage: "/images/image.jpg",
                imageId: "/ESTCUBE/GroundStations/ES5EC/Image-cam1",
            }

        };
    }
);
