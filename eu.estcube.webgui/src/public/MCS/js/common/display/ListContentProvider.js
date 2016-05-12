define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dgrid/OnDemandList",
    "./ContentProvider",
    ],

    function(declare, Lang, List, ContentProvider) {
        return declare(ContentProvider, {
            list: null,
            getContent: function() {
                this.list = new List({
                    store: this.store,
                    query: this.query,
                    renderRow: this.formatter,
                });

                return this.list;
            },

            startup: function() {
                this.list.startup();
                // XXX - workaround for grid titles not visible bug
                setTimeout(Lang.hitch(this, function() { this.list.set("showHeader", true) }), 500);
            },

        });
    }
);