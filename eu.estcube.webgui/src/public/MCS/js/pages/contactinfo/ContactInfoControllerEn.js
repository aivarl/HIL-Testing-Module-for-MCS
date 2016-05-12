define([
        "dojo/_base/declare", 
        "common/Controller", 
        "./ContactInfoView",
        "config/config",
        ],

function(declare, Controller, ContactInfoView, Config) {
	var s = declare([Controller], {
		constructor : function() {
			this.view = new ContactInfoView(Config.CONTACTINFO_SLANGUAGE_EN.SATGS, Config.CONTACTINFO_SLANGUAGE_EN.UTC, Config.CONTACTINFO_SLANGUAGE_EN.MET);
		},
		index : function(params) {
			this.placeWidget(this.view);
		},
	});
	return new s();
});
