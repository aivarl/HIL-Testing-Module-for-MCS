define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dgrid/OnDemandGrid",
    "./ContentProvider",
    ],

    function(declare, Lang, Grid, ContentProvider) {
        return declare(ContentProvider, {

                grid: null,

                getContent: function() {
                    this.grid = new Grid({
                        columns: this.columns,
                        store: this.store,
                        query: this.query,
                        style: this.style || {},
                    });

                    if (this.orderBy) {
                        this.grid.set("sort", this.orderBy, this.sortOrder && this.sortOrder.toUpperCase() == "DESC");
                    }

                    return this.grid;
                },

                startup: function() {
                    this.grid.startup();
                    // XXX - workaround for grid titles not visible bug
                    setTimeout(Lang.hitch(this, function() { this.grid.set("showHeader", true) }), 500);
                },

            });
    }
);