define([
    "config/config",
    "dojo/date/locale"
    ],

    function(Config, Locale) {
        return function(timestamp) {
             return timestamp == null ? "" : Locale.format(new Date(timestamp), {
                selector: "time",
                timePattern: Config.SHORTER_TIME_FORMAT,
            });
        };
    }
);