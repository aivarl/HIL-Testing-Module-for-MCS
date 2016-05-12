define([
    "dojo/_base/declare", 
    "dojo/_base/lang", 
    "dojo/_base/array", 
    "dojo/dom-class",
    "common/display/Dashboard", 
    "common/display/TelemetryContentProvider",
    "common/formatter/DateFormatter", 
    "common/formatter/TelemetryFormatter",
    "common/store/MissionInformationStore", 
    "common/store/ParameterStore", 
    "common/store/TelemetryQuery",
    "config/config",
    "dijit/registry",
    ], 
    function(declare, Lang, Arrays, DomClass, Dashboard, TelemetryContentProvider, DateFormatter,
    		TelemetryFormatter, MissionInformationStore, ParameterStore, TelemetryQuery, Config, DijitRegistry) {

		return declare([], {
	        constructor: function (args) {
	            var config = [{
	                title: "General",
	                contentProvider: new TelemetryContentProvider({
	                    query: Lang.partial(TelemetryQuery, ["CDHS"], ["adcs5v", "ctl_adcs_5v", "ctl_adcs_cs"]),
	                    name: "ADCS-General",
	                    domClasses: "adcs-general-grid"
	                }),
	            }, {
	                title: "Temps",
	                contentProvider: new TelemetryContentProvider({
	                    query: Lang.partial(TelemetryQuery, ["CDHS"],
	                    	["g0t", "g1t", "g2t", "g3t", "g4t", "gt0", "gt1", "gt2", "gt3", "gt4", "grt0", "grt1", "grt2", "grt3", "grt4", "at1", "at2", "art1", "art2", "st0", "st1"]),
	                    name: "ADCS-Temps",
	                    domClasses: "adcs-temps-grid"
	                }),
	            }, {
	                title: "Tether",
	                contentProvider: new TelemetryContentProvider({
	                    query: Lang.partial(TelemetryQuery, ["CDHS"], ["tether", "anode"]),
	                    name: "ADCS-Tether",
	                    domClasses: "adcs-tether-grid"
	                }),
	            }, {
	                title: "Gyros",
	                contentProvider: new TelemetryContentProvider({
	                    query: Lang.partial(TelemetryQuery, ["CDHS"],
	                    	["gvx", "gvy", "gvz", "g0x", "g0y", "g0z", "g1x", "g1y", "g1z","g2x", "g2y", "g2z", "g3x", "g3y", "g3z", "g4x", "g4y", "g4z"]),
	                    name: "ADCS-Gyros",
	                    domClasses: "adcs-gyros-grid"
	                }),
	            }, {
	                title: "Sun Sensors",
	                contentProvider: new TelemetryContentProvider({
	                    query: Lang.partial(TelemetryQuery, ["CDHS"],
	                    	["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", // sunsensors
	                		 "s12", "s13", "s14", "s15", "s16", "s17", "s18", "s19", "s20", "s21", "s22", "s23"]),
	                    name: "ADCS-Sun Sensors",
	                    domClasses: "adcs-sunsensors-grid"
	                }),
	            }, {
	                title: "Magnetometers",
	                contentProvider: new TelemetryContentProvider({
	                    query: Lang.partial(TelemetryQuery, ["CDHS"], ["m0x", "m0y", "m0z", "m1x", "m1y", "m1z"]),
	                    name: "ADCS-Magnetometers",
	                    domClasses: "adcs-magnetometers-grid"
	                }),
	            }, {
	                title: "Coils",
	                contentProvider: new TelemetryContentProvider({
	                    query: Lang.partial(TelemetryQuery, ["CDHS"],
	                    	["resx", "resy", "resz", "ctimestamp", "timeout", "pwm_a", "pwm_b", "pwm_c", "dir_a", "dir_b", "dir_c", "coil_a_cs", "coil_b_cs", "coil_c_cs"]),
	                    name: "ADCS-Coils",
	                    domClasses: "adcs-coils-grid"
	                }),
	            },
	            ];
	            
	            this.dashboard = new Dashboard({
	                config: config,
	                columns: Config.DASHBOARD.numberOfColumns,
	            });
	            DomClass.add(this.dashboard.getContainer().domNode, "fill");
	        },
	
	        getContent: function() {
	        	return this.dashboard.getContainer();
	        },
	        
	        placeAt: function (container) {
	            this.dashboard.placeAt(container);
	        },
	    });
	}
);