define([
    "dojo/_base/declare",
    "common/Controller",
    "config/config",
    ],

    function(declare, Controller, Config) {
        var s = declare([Controller], {

            index: function(params) {
                document.location.href = Config.LOGOUT_PATH;
            },

        });
        return new s();
    }
);
