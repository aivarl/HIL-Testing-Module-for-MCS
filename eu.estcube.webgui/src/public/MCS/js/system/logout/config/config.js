define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                LOGOUT: {
                    path: "logout",
                    defaults: {
                        controller: "Logout/LogoutController",
                        method: "index",
                    }
                },
            },
        };
    }
);
