define([
    "dojo/dom",
    "dojo/domReady!"
    ],

    function(dom) {
        return {
            routes: {
                GS_TNC: {
                    path: "GS/TNC",
                    defaults: {
                        controller: "GSTnc/TncController",
                        method: "index",
                    }
                },
            }

        };
    }
);
