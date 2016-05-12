define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
            	ESTCube1_SUBSYS_EPS: {
                    path: "ESTCube-1/subSystems/eps",
                    defaults: {
                        controller: "ESTCube-1.subsys.eps/EpsController",
                        method: "index",
                    }
                },
            },

        };
    }
);
