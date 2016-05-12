define([
    "dojo/_base/declare",
    "dijit/Tooltip",
    ],

    function(declare, Tooltip) {
        return declare(null, {

            constructor: function(content, formatter, timeout) {

                var lastShowId;
                var lastHideId;

                content.on(".dgrid-row:mouseover", function(evt) {
                    var newId = content.row(evt).id;
                    if (newId != lastShowId) {
                        lastShowId = newId;
                        lastHideId = null;
                        var tooltipContent = formatter(content.row(evt).data);
                        Tooltip.show(tooltipContent, content.row(evt).element);

                        // XXX - 28.03.2013, kimmell - find better way to cancel tooltip in case
                        // the grid is removed from the screen
                        setTimeout(function() {
                            Tooltip.hide(content.row(evt).element);
                        }, timeout || 3000);
                    }
                });

                content.on(".dgrid-row:mouseout", function(evt) {
                    var newId = content.row(evt).id;
                    if (newId != lastHideId) {
                        lastHideId = newId;
                        lastShowId = null;
                        Tooltip.hide(content.row(evt).element);
                    }
                });
            },
        });
    }
);
