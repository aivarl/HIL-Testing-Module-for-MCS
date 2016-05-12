define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "config/config",
   ],

    function(declare, DomConstruct, ContentPane, Button, Config) {

        return declare([], {

            constructor: function(args) {

                this.button = new Button({ label: Config.DEMO.buttonLabel, title: Config.DEMO.buttonTooltip });
                this.text = new ContentPane({ innerHTML: "TODO: write long explanation here ..." });
            },

            placeAt: function(container) {
                this.button.placeAt(container);
                this.text.placeAt(container);
            },

        });
    }
);
