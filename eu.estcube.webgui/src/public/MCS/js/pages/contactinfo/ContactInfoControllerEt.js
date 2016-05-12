define([
        "dojo/_base/declare", 
        "common/Controller", 
        "./ContactInfoView",
        "config/config",
        ],

function(declare, Controller, ContactInfoView, Config) {
	var s = declare([Controller], {
		constructor : function() {
			this.view = new ContactInfoView(Config.CONTACTINFO_SLANGUAGE_ET.SATGS, Config.CONTACTINFO_SLANGUAGE_ET.UTC, Config.CONTACTINFO_SLANGUAGE_ET.MET);
		},
		index : function(params) {
			this.placeWidget(this.view);
		},
	});
	return new s();
});
