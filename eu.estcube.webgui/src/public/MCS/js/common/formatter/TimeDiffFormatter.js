define([
    "config/config",
    "dojo/date/locale"
    ],

    function(Config, Locale) {
        return function(startMillis, endMillis) {
        	var timeDiff = Math.round( (endMillis - startMillis) / 1000.0 );
        	var s = timeDiff % 60;
        	var m = ((timeDiff - s) % 3600) / 60.0;
        	var h = (timeDiff - s - m * 60) / 3600.0;
        	if (s < 10) s = "0" + s;
        	if (m < 10) m = "0" + m;
        	if (h < 10) h = "0" + h;

        	return "" + h + ":" + m + ":" + s;


/*
			OLD CODE

            var diff = endMillis - startMillis;
            var secs = Math.floor(diff / 1000);
            var hh = Math.floor(secs / (60 * 60));

            var divisorForMinutes = secs % (60 * 60);
            var mm = Math.floor(divisorForMinutes / 60);

            var divisorForSeconds = divisorForMinutes % 60;
            var ss = Math.ceil(divisorForSeconds);
            // Ensure we have two-digits
            if (hh < 10) {
                hh = "0" + hh;
            }
            if (mm < 10) {
                mm = "0" + mm;
            }
            if (ss < 10) {
                ss = "0" + ss;
            }
            // This formats the string to HH:MM:SS
            var t = hh + ":" + mm + ":" + ss;
            return t;
*/
        };
    }
);
