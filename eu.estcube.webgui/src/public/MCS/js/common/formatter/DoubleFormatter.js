define([],

    function() {
        return function(d, decimalPlaces) {
            var p = Math.pow(10, decimalPlaces || 2);
            return Math.round(d * p) / p;
        };
    }
);