define([
    "dojo/_base/declare",
    "dijit/layout/ContentPane",
    ],

    function(declare, ContentPane) {
        return [
            declare(null, {

                constructor: function(args) {
                    declare.safeMixin(this, args);
                    console.log("[ContentProvider] init " + this.declaredClass + ": " + this.name);
                },

                getContent: function() {
                    var result = new ContentPane({ content: "Function getContent() not implemented in " + this.declaredClass + "!" });
                    return result;
                },

                // this method is called by "content handler" (for example Dashboard)
                // after content returned by getContetent() is added to the layout
                initialize: function() {
                    // call the startup function
                    this.startup();
                    // call the onStartup callback
                    if (this.onStartup) {
                        this.onStartup(this);
                    }
                },

                startup: function() {
                    // can be implemented in sub-classes
                },

            }),

        ];
    }
);