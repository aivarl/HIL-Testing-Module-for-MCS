define([
    "dojo/dom",
    "dojo/domReady!"
    ],

    function(dom) {
        return {
            routes: {
                GS_WEBCAM: {
                    path: 
                    	"GS/webcam",
                    defaults: {
                        controller: "GSWebCam/WebCamController",
                        method: "index",
                    }
                },
            },

            ES5EC_WEBCAM: {
                initialImage: "/images/image.jpg",
                imageId: "/ESTCUBE/GroundStations/ES5EC/Image-cam1",
            }

        };
    }
);
