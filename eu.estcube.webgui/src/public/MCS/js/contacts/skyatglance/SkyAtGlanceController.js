define(["dojo/_base/declare", 
        "common/Controller", 
        "./SkyAtGlanceView"
        ],
    
    function (declare, Controller, SkyAtGlanceView) {
        var s = declare([Controller], {
            constructor: function () {
                this.view = new SkyAtGlanceView();
            },

            index: function (params) {
                this.placeWidget(this.view);
            },
            
            clear: function () {
                this.view.hide();
            }

        });
        
        return new s();
    }
);
