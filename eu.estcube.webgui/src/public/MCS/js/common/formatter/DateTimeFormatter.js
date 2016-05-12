define([
    "dojo/date/locale"
    ],

    function(Locale) {
        return function(timestamp) {
             return timestamp == null ? "" : Locale.format(new Date(timestamp), {
                selector: "date",
                datePattern: "dd.MM.yy HH:mm:ss",
            });
        };
    }
);
