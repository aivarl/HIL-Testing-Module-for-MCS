define([], function () {
    return function (subSystem, filter, message) {
        if (/\/ESTCUBE\/Satellites\/.*\/.*/.test(message.ID) && message["class"] != "Metadata") {
            if ((filter == undefined) && (subSystem == undefined)) {
                return true;
            } else {
                var subSystem = subSystem;
                var patt = new RegExp(subSystem, "g");
                for (var i = 0; i < subSystem.length; i++) {
                    var subRegEx = new RegExp(subSystem[i], "g");
                    if ((subSystem != undefined) && (filter == undefined)) {
                        if (subRegEx.test(message.ID)) {
                            return true;
                        }
                    } else if ((subSystem != undefined) && (filter != undefined)) {
                        if ((subRegEx.test(message.ID)) && (filter.indexOf(message.name) != -1)) {
                            return true;
                        }
                    }
                }
            }
        }
    }
});