define([
    "dojo/domReady!"
    ],

    function(ready) {
        return {
            routes: {
                GS_WEATHER: {
                    path: "GS/weather",
                    defaults: {
                        controller: "GSWeather/WeatherController",
                        method: "index",
                    }
                },
            },

            GS_WEATHER: {
                numberOfColumns: 3,
            }

        };
    }
);
