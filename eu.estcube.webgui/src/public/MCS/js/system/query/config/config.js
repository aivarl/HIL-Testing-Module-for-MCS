define([
    "dojo/dom",
    "dojo/domReady!"
    ],

    function(dom) {
        return {
            routes: {
                QUERY: {
                    path: "system/query",
                    defaults: {
                        controller: "Query/QueryController",
                        method: "index"
                    }
                }
            },
            SUBMIT_URL:                 "/customQuery"
        };
    }
);
