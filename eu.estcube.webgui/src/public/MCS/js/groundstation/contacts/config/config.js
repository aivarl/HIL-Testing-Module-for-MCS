define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                GS_CONTACTS: {
                    path: "GS/contacts",
                    defaults: {
                        controller: "GSContacts/ContactsController",
                        method: "index",
                    }
                },
            }

        };
    }
);
