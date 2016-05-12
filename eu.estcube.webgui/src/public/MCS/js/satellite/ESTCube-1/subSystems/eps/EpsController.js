define([
        "dojo/_base/declare", 
        "common/Controller", 
        "./EpsView",
        ],

function(declare, Controller, EpsView) {
	var s = declare([Controller], {
		constructor : function() {
            this.epsViewWidget = new EpsView();
		},
		index : function(params) {
		    this.placeWidget(this.epsViewWidget);
		},
	});
	return new s();
});
