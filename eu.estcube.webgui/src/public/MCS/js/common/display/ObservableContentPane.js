define(["dojo/_base/declare",
        "dijit/layout/ContentPane"],
        // ContentPane that emits a "resized" event on each resize
        function(declare, ContentPane) {
            return declare([ContentPane], {
                resize: function() {
                    this.inherited(arguments);
        
                    this.emit("resized", {});
                }
            });
        }
);