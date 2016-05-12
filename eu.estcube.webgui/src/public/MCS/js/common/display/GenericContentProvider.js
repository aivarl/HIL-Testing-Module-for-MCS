define([
    "dojo/_base/declare",
    "dijit/layout/ContentPane",
    "./ContentProvider",
    ],

    function(declare, ContentPane, ContentProvider) {
        return declare(ContentProvider, {
            getContent: function() {
                var pane = new ContentPane({ content: this.content });
                return pane;
            },
        });
    }
);