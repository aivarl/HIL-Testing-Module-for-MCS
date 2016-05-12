define([
    "dojo/_base/declare",
    "config/config",
   ],

    function(declare, Config) {

        return declare([], {

            timestamp: null,
            issuedBy: Config.SERVICE_ID,
            level: "INFO",
            value: "n/a",

            constructor: function(args) {
                declare.safeMixin(this, args);
                if (!this.timestamp) {
                    this.timestamp = Date.now();
                }
            },

        });
    }
);
