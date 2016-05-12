define([
    "config/config",
    ],

    function(Config) {
        return function (object) {

            if (object.name == "version") {
                var versionNumber = object.value;
                var versionNumberType = typeof versionNumber;
                var hexString;
                
                if(versionNumberType == "number"){
                    hexString = versionNumber.toString(16).toUpperCase();
                    return "0x" + hexString;
                }
                else if(versionNumberType == "string"){
                    hexString = versionNumber.toUpperCase();
                    return "0x" + hexString;
                }
                
            } else {
                return object.value;
            }

        };
    }
);