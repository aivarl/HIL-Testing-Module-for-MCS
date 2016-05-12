define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                ESTCube1_DASHBOARD: {
                    path: "ESTCube-1/dashboard",
                    defaults: {
                        controller: "ESTCube-1.dashboard/DashboardController",
                        method: "index",
                    }
                },
            },

            ESTCube1_DASHBOARD: {
                numberOfColumns: 3,
                initialImage: "/images/image.jpg",
                imageId: "/ESTCUBE/GroundStations/ES5EC/Image-cam1",
            }
        };
    }
);
