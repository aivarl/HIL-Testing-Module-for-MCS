define(["dojo/_base/array"], function(Arrays) {
    function SplitString(s, fieldSizes) {
        var parts = [];
        
        Arrays.forEach(fieldSizes, function(sz) {
            parts.push(s.substring(0, sz));
            s = s.substring(sz);
        });
        
        return parts;
    }
    
    function Join(strings, sep) {
        var joined = "";
        
        Arrays.forEach(strings, function(s) {
           joined += sep + s; 
        });
        
        return joined;
    }
    
    var normalModeFields = [6, 1, 7, 2, 2, 2, 2, 2, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1];
    var safeModeFields = [6, 1, 7, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2];
    
    return function(beacon) {
        var mode = beacon[6];
        
        if(mode != 'E' && mode != 'T') {
            console.error("Unknown mode field value in beacon: " + mode);
            return "Error: unknown mode " + mode;
        }
        
        return Join(SplitString(beacon, mode == 'E' ? normalModeFields : safeModeFields), " ");
    }
});