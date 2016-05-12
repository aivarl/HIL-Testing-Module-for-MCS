define([
        "dojo/_base/declare", 
        "common/Controller", 
        "./DashboardView",
        ],

function(declare, Controller, DashboardView) {
	var s = declare([Controller], {
		constructor : function() {
			this.dashView = new DashboardView();
		},
		index : function(params) {
			this.placeWidget(this.dashView);
		},
	});
	return new s();
});
