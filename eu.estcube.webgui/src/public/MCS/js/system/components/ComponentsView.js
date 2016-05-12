define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dijit/layout/StackContainer",
    "dgrid/OnDemandGrid",
    "config/config",
    "common/formatter/DateFormatter",
    "common/formatter/StatusFormatter",
    "common/store/BusinessCardStore",
    ],

    function(declare, Lang, DomConstruct, DomClass, StackContainer, Grid, Config, DateFormatter, StatusFormatter, store) {

        function getStatus(component, now) {
            var period = parseInt(component.period);
            var diff = getTimeout(component, now);
            return diff <= 0 ? "OK" : (diff > period ? "Error" : "Warning");
        }

        function getTimeout(component, now) {
            var timestamp = parseInt(component.timestamp);
            var period = parseInt(component.period);
            var diff = now - (timestamp + period);
            return diff;
        }

        return declare([], {

            constructor: function(args) {
                this.grid = new Grid({
                        store: store,
                        columns: {
                            name: { label: "Component Name", className: "field-name" },
                            timestamp: { label: "Timestamp", className: "field-timestamp", formatter: DateFormatter, },
                            status: { label: "Status", className: "field-status", renderCell: StatusFormatter, },
                            host: { label: "Host", className: "field-host" },
                            period: { label: "Period", className: "field-period" },
                            description: { label: "Description", className: "field-description" },
                        }
                    });
                    this.grid.set("sort", "name", true);
                    DomClass.add(this.grid.domNode, "fill");
                    this.grid.startup();

                    // XXX - workaround for grid titles not visible bug
                    setTimeout(Lang.hitch(this, function() { this.grid.set("showHeader", true) }), 500);

                    setInterval(Lang.hitch(this, function() {
                        var now = new Date().getTime();
                        store.query(function(item) {
                            return getTimeout(item, now) > 0;
                        }).forEach(function(item) {
                            item.status = getStatus(item, now);
                            store.put(item);
                        });

                    }), Config.SYSETM_COMPONENTS.STATUS_CHECK_INTERVAL);
            },

            placeAt: function(container) {
                DomConstruct.place(this.grid.domNode, container);
            },

        });
    }
);
