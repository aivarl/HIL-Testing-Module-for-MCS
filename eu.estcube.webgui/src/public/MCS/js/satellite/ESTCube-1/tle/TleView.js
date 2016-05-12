define([
    "dojo/_base/declare",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/topic",
    "dijit/form/Form",
    "dijit/form/Button",
    "dijit/form/ValidationTextBox",
    "dijit/form/SimpleTextarea",
    "dijit/layout/ContentPane",
    "dojox/layout/TableContainer",
    "dgrid/OnDemandList",
    "config/config",
    "common/formatter/DateFormatter",
    "common/store/TleStore",
    "common/store/ResolveById",
    "dijit/Tooltip",
    "dojo/ready",
   ],

    function(declare, DomClass, DomConstruct, On, Topic, Form, Button, ValidationTextBox, SimpleTextarea, ContentPane, TableContainer, List, Config, DateFormatter, TleStore, ResolveById, Tooltip, ready) {

        return declare([], {

            constructor: function(args) {
                    this.tleContainer = DomConstruct.create("div", { "class": "tle-container" });
                    var div = DomConstruct.create("div", { }, this.tleContainer);
                    var form = new Form({ encType: "multipart/form-data", action: "", method: "" }, div);

                    var table = new TableContainer({
                        cols: 1,
                        labelWidth: "100px",
                    });

                    var textSource = new ValidationTextBox({ name: "tleSource", label: "TLE Source",placeHolder: "Source of TLE", required: true });

                    ready(function(){
                        new Tooltip({
                            connectId: textSource.id,
                            label: "Enter either uploader name or database name"
                        });
                    });

                    var textTleValue = new SimpleTextarea({ name: "tleText", label: "TLE Value", cols: 70, rows: 2 });

                    ready(function(){
                        new Tooltip({
                            connectId: textTleValue.id,
                            label: "Enter only the two rows of TLE"
                        });
                    });

                    var buttonWrapper = new ContentPane({ style: "margin: 0px; padding: 0px;" });
                    var buttonSubmit = new Button({ label: "Submit", title: "Upload TLE" });
                    buttonWrapper.addChild(buttonSubmit);

                    table.addChild(textSource);
                    table.addChild(textTleValue);
                    table.addChild(buttonWrapper);

                    form.domNode.appendChild(table.domNode);

                    tleList = new List({
                        store: TleStore,
                        query: { satelliteId: Config.TLE.SATELLITE_ID },
                        renderRow: function(tle) {
                            var div = DomConstruct.create("div", { "class" : "tle-row-div" });
                            var spanDate = DomConstruct.create("span", { innerHTML: DateFormatter(tle.timestamp),"class" : "tle-span-date"}, div);
                            var spanSat = DomConstruct.create("span", { "class" : "tle-span-sat"}, div);
                            ResolveById(tle.satelliteId, spanSat);
                            var spanSatID = DomConstruct.create("span", { innerHTML: tle.ID+':'+tle.timestamp,"class" : "tle-sat-id"}, div);
                            var spanUploader = DomConstruct.create("span", { innerHTML: "Uploader: " + tle.issuedBy,"class" : "tle-span-uploader"}, div);
                            var line1 = DomConstruct.create("pre", { innerHTML: tle.tleLine1 + "\n" + tle.tleLine2,"class" : "tle-lines" }, div)
                            return div;
                        },
                    });
                    tleList.set("sort", "timestamp", true);
                    DomClass.add(form.domNode, "pageElement");
                    DomClass.add(tleList.domNode, "pageElement");
                    DomClass.add(form.domNode, "commandingPageElementForm");
                    DomClass.add(tleList.domNode, "commandingPageElementList");
                    DomConstruct.place(tleList.domNode, this.tleContainer);

                    table.startup();
                    tleList.startup();

                    On(buttonSubmit, "click", function() {
                        if (form.validate()) {
                            var value = form.get("value");
                            value.satelliteId = Config.TLE.SATELLITE_ID;
                            Topic.publish(Config.TLE.TOPIC_TLE_SUBMIT, value);
                            form.reset();
                        } else {
                            alert("Invalid data! Fix errors and resubmit!");
                        }
                    });
            },

            placeAt: function(container) {
                DomConstruct.place(this.tleContainer, container);
            },

        });
    }
);
