define([
    "config/config",
    "dojo/date/locale"
    ],

    function(Config, Locale) {
        return function(id) {
            var split = id.split("/");
            var name = split[Math.max(0, split.length - 1)];
            return name.length > 1 ? name.charAt(0).toUpperCase() + name.slice(1) : name;
        };
    }
);