define([
    "dojo/_base/declare",
    ],

    function(declare) {

        return declare(null, {

            init: function(config, container) {
                this.config = config;
                this.container = container;
            },

            placeWidget: function(widget, clear) {
                if (clear) {
                    this.clearAllContent();
                }

                if (!widget.placeAt) {
                    console.error("widget does not have method placeAt, are you sure you are adding a widget?");
                    return;
                }

                widget.placeAt(this.getContainer());
            },

            placeHtml: function(html, clear) {
                if (clear) {
                    this.clearAllContent();
                }
                this.getContainer().innerHTML = html;
            },

            destroy: function() {
                this.clearAllContent();
            },

            clearAllContent: function() {
                // TODO - 09.03.2013, kimmell - destroy widgets?
                this.getContainer().innerHTML = "";
            },

            getConfig: function() {
                return this.config;
            },

            getContainer: function() {
                return this.container;
            },

            setup: function() {
            },

        });
    }
);
