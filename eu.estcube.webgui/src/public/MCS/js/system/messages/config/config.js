define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                MESSAGES: {
                    path: "system/messages",
                    defaults: {
                        controller: "Messages/MessagesController",
                        method: "index",
                    }
                },
            },

            MESSAGES: {
            }

        };
    }
);
