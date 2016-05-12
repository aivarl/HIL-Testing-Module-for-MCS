define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-class",
    ],

    function(declare, Arrays, Lang, DomConstruct, DomClass) {

        var labelStyle = {
            float: "left",
            clear: "both",
        };

        var valueWrapperStyle = {
            float: "left",
        };

        function createSimpleRow(parent, label, values) {
            var row = createEmptyRow(parent);
            var label = DomConstruct.create("div", {
                innerHTML: label,
                style: labelStyle,
            }, row);

            var valueWrapper = DomConstruct.create("div", {
                style: valueWrapperStyle,
            }, row);

            Arrays.forEach(values, function(item) {
                DomConstruct.create("div", {
                    innerHTML: item,
                }, valueWrapper);
            });

            return row;
        }

        function createConfiguredRow(parent, config, labelClass, values, valueClass) {
            var row = createEmptyRow(parent);
            var label = DomConstruct.create("div", {
                innerHTML: config.label || "",
                style: labelStyle,
            }, row);
            if (labelClass) {
                DomClass.add(label, labelClass);
            }

            var valueWrapper = DomConstruct.create("div", {
                style: valueWrapperStyle,
            }, row);
            if (valueClass) {
                DomClass.add(valueWrapper, valueClass);
            }

            Arrays.forEach(values, function(item) {
                var valueDiv = DomConstruct.create("div", {
                    innerHTML: config.formatter ? config.formatter(item) : item,
                }, valueWrapper);

                if (config.className) {
                    DomClass.add(valueDiv, config.className);
                }
            });

            return row;

        }

        function valueAsArray(value) {
            var values;
            if (!Lang.isArray(value)) {
                values = [];
                values.push(value);
            } else {
                values = value;
            }
            return values;
        }

        function createEmptyRow(parent) {
            return DomConstruct.create("div", { }, parent);
        }

        return {
            toDiv: function(object, config) {
                var div = DomConstruct.create("div", { });
                if (config) {
                    if (config.title) {
                        var title = DomConstruct.create("div", { innerHTML: config.title }, div, "last");
                        if (config.titleClass) {
                            DomClass.add(title, config.titleClass);
                        }
                    }
                    for (var key in config.rows) {
                        var values = valueAsArray(object[key]);
                        var row = createConfiguredRow(div, config.rows[key], config.labelClass, values, config.valueClass);
                        if (config.rowClass) {
                            DomClass.add(row, config.rowClass);
                        }
                    }
                } else {
                    for (var key in object) {
                        var values = valueAsArray(object[key]);
                        var row = createSimpleRow(div, key, values);
                    }
                }
                return div;
            }
        }
    }
);