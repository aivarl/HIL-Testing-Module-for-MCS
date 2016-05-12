define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/dom-style",
    "dijit/layout/_LayoutWidget",
    ],

    function(declare, Arrays, DomStyle, Widget) {

        return declare(Widget, {

                layout: function() {
                    Arrays.forEach(this.getChildren(), function(child, index) {
                        var node = child.domNode || child;
                        // using inline-block as display for the child
                        // to put them all on the same line
                        DomStyle.set(node, {
                            "display": "inline-block",
                        });
                        // calling resize to make child visible
                        child.resize();
                    }, this);

                    // using text-align center to center all the children
                    DomStyle.set(this.domNode, {
                        "text-align": "center",
                    });
                },

            });

    }
);