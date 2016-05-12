define([
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-attr",
        "dijit/layout/ContentPane",
        "./ContentProvider",
        ],

/**
 * When creating WebCam content provider, you can set image size with setting
 * "width" argument. If you dont set the argument, default size will be chosen.
 */

    function(declare, Lang, DomConstruct, DomAttr, ContentPane, ContentProvider) {
        return declare(ContentProvider, {
            getContent: function() {
                var img = DomConstruct.create("img", {
                    alt: "Webcam image",
                    src: this.initialImage
                });
                img.style.width = this.width;
                var pane = new ContentPane({
                    content: img
                });

                var result = this.store.query({
                    ID: this.imageId
                });

                result.forEach(Lang.hitch(this, function(value) {
                    this.updateImage(img, value);
                }));

                result.observe(Lang.hitch(this, function(value) {
                    this.updateImage(img, value);
                }), true);
                return pane;
            },

            updateImage: function(img, value) {
                if (!/image\//.test(value.format)) {
                    // no format set; return
                    return;
                }
                dojo.attr(img, {
                    src: "data:" + value.format + ";base64," + value.rawData,
                    alt: value.name
                });
            }

        });
    });