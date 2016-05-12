define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/dom-geometry",
    "./Panel",
    "./ContentProvider",
    ],

    function(declare, Arrays, Lang, Aspect, DomGeometry, Panel, ContentProvider) {
        return declare(ContentProvider, {

            margin: 3,

            getContent: function() {
                var pane = new Panel();
                Arrays.forEach(this.providers, function(provider, index) {
                    var content = provider.getContent();
                    pane.addChild(content);
                    provider.startup();
                });

                // create some empty space around provided contents
                Aspect.after(pane, "startup", Lang.hitch(this, function() {

                    setTimeout(Lang.hitch(this, function() {

                        Arrays.forEach(pane.getChildren(), function(item, index) {
                            var box = DomGeometry.getContentBox(item.domNode);
                            box.l = box.l - this.margin;
                            box.t = box.t - this.margin;
                            box.w += this.margin * 2;
                            box.h += this.margin * 2;
                            DomGeometry.setContentSize(item.domNode, box);
                        }, this);
                    }), 100);
                }));

                return pane;
            },

        });
    }
);