define([
    "config/config",
    "dojo/date/locale"
    ],

    function(Config, Locale) {
        return function(timestamp) {
             return timestamp == null ? "" : Locale.format(new Date(timestamp), {
                selector: "date",
                datePattern: Config.DEFAULT_DATE_FORMAT_NO_MS,
            });
        };
    }
);
