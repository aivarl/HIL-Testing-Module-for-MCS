define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/aspect",
    "dojo/dom-class",
    "dgrid/OnDemandGrid",
    "dgrid/util/misc",
    "./ContentProvider",
    "common/store/MissionInformationStore",
    "common/store/ResolveById",
    "common/formatter/DateFormatter",
    ],

    function(declare, Lang, Arrays, Aspect, DomClass, Grid, Misc, ContentProvider, MissionInformationStore, ResolveById, DateFormatter) {

        function getClassForEvent(event, now) {
            if (event.endTime < now) {
                return "past";
            }
            if (event.startTime > now) {
                return "future";
            }
            return "in-progress";
        }

        return declare(ContentProvider, {

                grid: null,
                store: MissionInformationStore,
                lookupStore: MissionInformationStore,
                orderBy: "startTime",
                sortOrder: "ASC",

                constructor: function(groundStationId, args) {
                	this.groundStationId = groundStationId;
                	this.query = { class: "LocationContactEvent", groundStationId: this.groundStationId };
                	// passing arguments to superclass constructor
                    this.inherited(arguments, [ args ]);
                },
                
                getContent: function(args) {
                    declare.safeMixin(this, args);

                    this.grid = new Grid({
                        columns: this.columns || {
                            satelliteId: {
                                label: "Name",
                                className: "field-satellite",
                                renderCell: Lang.hitch(this, function(object, value, node, options) {
                                    ResolveById(value, node, this.lookupStore);
                                }),
                            },
                            orbitNumber: { label: "Orbit", className: "field-unit", },
                            startTime: { label: "Start Time", className: "field-timestamp", formatter: DateFormatter },
                            endTime: { label: "End Time", className: "field-timestamp", formatter: DateFormatter },
                        },
                        store: this.store,
                        query: this.query,
                    });

                    // TODO - 06.05.2013, kimmell - fix the scrolling for cases where grid is invisible at the beginning
                    // Eg. go to debug page, hit reload, go to dashboard

                    // using debounce here to call scrollToCurrent only once in the given time window
                    var scrollWrapper = Misc.debounce(this.scrollToCurrent, this, 1000);

                    // update row classes based on values
                    Aspect.after(this.grid, "renderRow", Lang.hitch(this, function(row, object) {
                        var now = Date.now();
                        var className = getClassForEvent(object[0], now);
                        DomClass.add(row, className);
                        // call scroll wrapper
                        scrollWrapper(this.grid, this.store, this.query);
                        return row;
                    }));

                    // set sorting
                    this.grid.set("sort", this.orderBy, this.sortOrder && this.sortOrder.toUpperCase() == "ASC");

                    return this.grid;
                },

                scrollToCurrent: function(grid, store, query) {
                    var now = Date.now();
                    var results = store.query(query).filter(function(item) {
                        return item.endTime >= now;
                    });
                    if (results && results[0]) {
                        var row = grid.row(results[0]);
                        if (row.element) {
                            var rowIndex = Math.max(row.element.rowIndex - 1, 0);
                            var gridY = rowIndex * row.element.scrollHeight;
                            grid.scrollTo({ y: gridY });
                        }
                    }
                },

                startup: function() {
                    this.grid.startup();
                    // XXX - workaround for grid titles not visible bug
                    setTimeout(Lang.hitch(this, function() { this.grid.set("showHeader", true) }), 500);
                },

            });
    }
);
