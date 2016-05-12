define(["dojo/_base/declare", "common/Controller", "./TelemetryView", ],

function(declare, Controller, TelemetryView) {
	var s = declare([Controller], {

		constructor : function() {
			this.view = new TelemetryView();
		},

		index : function(params) {
			this.placeWidget(this.view);
		},

	});
	return new s();
});
