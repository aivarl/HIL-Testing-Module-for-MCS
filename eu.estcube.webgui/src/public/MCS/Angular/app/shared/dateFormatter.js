/**
 * Filter for formatting timestamp.
 */
// Add filter to module.
angular
    .module('MCS')
    .filter('dateFormatter', function(CONFIG){
        return function(timestamp){
            return timestamp == null ? "" : new Date(timestamp*1000);
        }
    });

