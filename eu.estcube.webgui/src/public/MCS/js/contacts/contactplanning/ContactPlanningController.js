define(["dojo/_base/declare", 
        "common/Controller", 
        "./ContactPlanningView"
        ],
    
    function (declare, Controller, ContactPlanningView) {
        var s = declare([Controller], {
            constructor: function () {
                this.view = new ContactPlanningView();
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
