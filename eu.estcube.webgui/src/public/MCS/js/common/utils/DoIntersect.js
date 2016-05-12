define([
        'dojo/_base/array'
        ],
        
        function(Arrays) {
            // Tests whether there is an object that is contained in both arrays
            return function(arr1, arr2) {
                return Arrays.some(arr1, function(role) {
                    return Arrays.indexOf(arr2, role) != -1 
                });
            }
        }
);