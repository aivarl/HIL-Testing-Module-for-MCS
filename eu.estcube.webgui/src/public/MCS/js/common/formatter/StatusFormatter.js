define([
    "dojo/dom-class",
    ],

    function(DomClass) {
        return function(object, value, node, options) {
            node.innerHTML = object.status; // same as value here
            if (value == "OK") {
                DomClass.add(node, "value-ok");
            }
            if (value == "Warning") {
                DomClass.add(node, "value-warning");
            }
            if (/Error.*/.test(value)) {
                DomClass.add(node, "value-error");
            }
        };
    }
);