define([], function() {
    return function(id) {
        return id.replace(/(_+)/g, "_$1").replace(/\//g, "_");
    }
});