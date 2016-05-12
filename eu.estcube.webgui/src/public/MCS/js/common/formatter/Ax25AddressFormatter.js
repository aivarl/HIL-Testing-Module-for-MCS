define([
    "config/config",
    "dojo/date/locale"
    ],

    function(Config, Locale) {

        function toSigned(value) {
            return value < 128 ? value : -128 + value - 128;
        }

        function toSignedBytes(hex) {
            var tmp = hex.replace(/ /g, "");
            var bytes = [];
            for (var i = 0; i < tmp.length; i += 2) {
                bytes.push(toSigned(parseInt(tmp.substr(i, 2), 16)));
            }
            return bytes;
        }

        function validateChar(c) {
            // Space and upper-case alpha and numeric ASCII characters only.
            return c== 32 || c >= 48 && c <= 57 || c >= 65 && c <= 90;
        }

        return function(hex) {
            if(hex == null || typeof(hex) == "undefined" || hex.trim() == "") {
                return "";
            }
            
            var bytes = toSignedBytes(hex);
            var result = [];
            var c;
            var isValid = true;
            for (var i = 0; i < bytes.length; i++) {
                if (i < bytes.length - 1) {
                    c = (bytes[i] & 0xFF) >> 1;
                    if (!validateChar(c)) {
                        isValid = false;
                    }
                    result.push(String.fromCharCode(c));
                } else {
                    result.push((((bytes[i] & 0xFF) >> 1) & 0x0F));
                }
            }
            return (!isValid? hex + " - " : "") + result.join("").replace(/[ ]+/, "-");
        };
    }
);