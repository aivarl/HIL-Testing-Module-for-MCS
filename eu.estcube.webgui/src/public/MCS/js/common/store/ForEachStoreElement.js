define(['dojo/_base/array'], function(Arrays) {
    // Calls <callback> for each element in the current <query> result and
    // all future query result set additions
    return function (query, callback) {
        Arrays.forEach(query, function(obj) {
            callback(obj);
        });

        return query.observe(function(obj, removedFrom, insertedInto) {
            if(insertedInto != -1) {
                callback(obj);
            }
        }, false);
    }
});