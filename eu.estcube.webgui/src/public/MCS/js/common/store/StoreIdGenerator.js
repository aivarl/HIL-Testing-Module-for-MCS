define([
    "dojox/uuid/generateRandomUuid",
    ],

    function(generateUuid) {

        return {
            generate: function(message, property) {
                if (!message[property]) {
                    message[property] = generateUuid();
                }
                return message;
            }
        };
    }
);
