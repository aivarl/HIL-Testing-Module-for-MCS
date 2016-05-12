define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/dom-construct",
    "dijit/layout/ContentPane",
    "common/display/Panel",
    "./ContentProvider",
    "dojox/dgauges/components/default/CircularLinearGauge",
    "dojox/dgauges/TextIndicator",
    "dojo/dom-geometry",
    "common/formatter/DoubleFormatter",
    ],

    function(declare, Lang, Aspect, DomConstruct, ContentPane, Panel, ContentProvider, CircularLinearGauge, TextIndicator, DomGeometry, DoubleFormatter) {

        return [
            declare("CircularLinearGaugeProvider", ContentProvider, {

                gauge: null,

                getContent: function() {
                    // TODO - 12.03.2013, kimmell - continue
                    // container to hold gauge and title
                    var div = DomConstruct.create("div", {});
                    // gauge placeholder
                    this.placeholder = DomConstruct.create("div", { style: this.gaugeSettings.style }, div, "first");
                    // title
                    var title = DomConstruct.create("div", {
                        innerHTML: this.gaugeSettings.title || " ",
                        style: this.gaugeSettings.titleStyle || "font-weight: bold;",
                    }, div, this.gaugeSettings.titlePlacement || "last" );
                    // creating content pane from the container
                    this.pane = new ContentPane({ content: div });
                    return this.pane;
                },

                startup: function() {
                    // XXX - 13.03.2013 kimmell - did not found better way to add gauge AFTER
                    //                            content pane is attached to the DOM and
                    //                            placholder div has his size computed.
                    setTimeout(Lang.hitch(this, function() {
                        // create gauge to placeholder
                        this.gauge = this.createGauge(this.placeholder);
                    }), 100);
                },

                createGauge: function(div) {
                    var gauge = new CircularLinearGauge(this.gaugeSettings, div);

                    if (this.textIndicator != null) {
                        var text = new TextIndicator(this.textIndicator);
                        gauge.addElement("text", text);
                    }

                    var result = this.store.query({ ID: this.parameterId });

                    // use the value from query to update the gauge
                    result.forEach(Lang.hitch(this, function(item) {
                        this.updateValue(gauge, item);
                    }));

                    // observe the result for the changes
                    result.observe(Lang.hitch(this, function(item) {
                        this.updateValue(gauge, item);
                    }), true);

                    return gauge;
                },

                updateValue: function(gauge, item) {
                    var val = parseFloat(item.value);
                    val = DoubleFormatter(val);
                    gauge.set("value", val);
                },
            }),

        ];
    }
);