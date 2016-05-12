define(['dojo/_base/declare', 
        'dojo/_base/lang', 
        'dojo/_base/array', 
        'dojo/_base/connect', 
        "dojo/date/locale",
        'dojo/dom-construct',
        'dojo/on', 
        'dojox/gfx',
        'dojox/layout/ExpandoPane', 
        'dijit/Tooltip', 
        'dijit/layout/BorderContainer',
        'dijit/layout/ContentPane', 
        'dijit/TitlePane', 
        'dijit/form/CheckBox',
        "common/TimeFactory",
        'common/store/MissionInformationStore',
        'common/store/ForEachStoreElement', 
        'common/formatter/DateFormatter',
        'common/formatter/TimeFormatter',
        'common/formatter/TimeDiffFormatter', 
        'common/formatter/DoubleFormatter', 
        'common/formatter/TimeFormatterS',
        'common/display/ObservableContentPane',
        'common/display/RadarViewContentProvider',
        "config/config",
        'dojo/cookie'
        ],

    function (declare, Lang, Arrays, connect, Locale, DomConstruct, on, Gfx, ExpandoPane, 
              Tooltip, BorderContainer, ContentPane, TitlePane, CheckBox, TimeFactory, MissionInformationStore, 
              ForEachStoreElement, DateFormatter, TimeFormatter, TimeDiffFormatter, DoubleFormatter,
              TimeFormatterS, ObservableContentPane, RadarViewContentProvider, Config, Cookie) {

		var satLaunchMs = 1367892391000; // 7 May 2013, 02:06:31 UTC
	
		var smallTextSize = 10;
		var mediumTextSize = 25;
		var bigTextSize = 37.5;
	
        var msInHour = 1000 * 60 * 60;
        var msInDay = 24 * msInHour;

        var conf = config.ESTCube1_CONTACTINFO;        

        function pad(number) {
            if ( number < 10 ) {
            	return '0' + number;
            }
            return number;
        }

        function formatClock(timestamp) {
        	var D = new Date(timestamp);
        	var clock = pad(D.getFullYear()) + "-" + pad(D.getUTCMonth() + 1) + "-" + pad(D.getUTCDate()) + " / " + pad(D.getUTCHours()) + ":" + pad(D.getUTCMinutes()) + ":" + pad(D.getUTCSeconds());
            return timestamp == null ? "" : clock;
        }

        function formatMET(timestamp) {
        	var elapsed = timestamp - satLaunchMs;
        	var days = ~~(elapsed / 86400000);
        	var D = new Date(elapsed);
        	var clock = days + " / " + pad(D.getUTCHours()) + ":" + pad(D.getUTCMinutes()) + ":" + pad(D.getUTCSeconds());
        	return timestamp == null ? "" : clock;
        }
        
        function dateStringUTC(timestamp, format){
        	var d = new Date(timestamp);
        	return d.format(format, true);
        }
        
        return declare([], {
           
        	 constructor: function(SATLOC, UTC, MET) {
                 var groundStationId = Cookie("gsSelector");
                 if (groundStationId != Config.CONTACTINFO_SETTINGS.groundStationId){
	                // to reload all the pages
 	                Cookie("gsSelector", Config.CONTACTINFO_SETTINGS.groundStationId, {expires: 3650});
	                window.location.reload();
                 }
                 this.mainContainer = DomConstruct.create("div",{
	            	innerHTML: "<div class='contentbox'><div class='firstinfo'>" + SATLOC + "</div>" +
						"<table id='aoslos'><tr><td><div id='aoslosstring'>AOSLOS</div></td><td><div id='aoslostime'>00:00:00</div></td></tr></table>" +
						"<div class='info'>" + UTC + ":</div>" +
						"<div class='clock' id='utcclock'>YYYY-MM-DD / HH:MM:SS</div>" +
						"<div class='info'>" + MET + ":</div>" + 
						"<div class='clock' id='metclock'>DAY / HH:MM:SS</div></div>",
             		id:"contactInfoContainer",
             		style: {                
                 		width: "100%",
                         height: "100%"
                }});
                
                TimeFactory.addListener (['aosLosInterval'], this, function( eventName, eventTime ) {

                    var color = "#FFC000";
                    if (eventTime >= 0) {
                        var eventTimeS = Math.round(eventTime/1000.0);
                        var formatterStartTime = new Date(0).getTime();

                        // Color the label according to events and time remaining
                        if (eventName == "LOS") {
                        	color = "#00B050";
                        } else {
                        	color = "#FF0000";
                        }                        
                    }
                    var time = TimeDiffFormatter(formatterStartTime, eventTime);
                    dojo.byId("aoslos").className = eventName;
                    dojo.byId("aoslosstring").innerHTML = eventName + ":";
                    dojo.byId("aoslostime").innerHTML = time;
                });
                
                TimeFactory.addListener (['clock'], this, function( eventName, eventTime ) {
                	var clocktext = formatClock(eventTime);
                	var METtext = formatMET(eventTime);
                    dojo.byId("utcclock").innerHTML = clocktext;
                    dojo.byId("metclock").innerHTML = METtext;
                });                
             },   
             
             recalculateStatus: function() {
                 var hidden = 0;
                 
                 for(var number = 0; number < this.satOrder.length; number++) {
                     var satID = this.satOrder[number];
                     
                     if(this.satStatus[satID].visible) {
                         var n = number - hidden;
                         this.satStatus[satID].numberAmongVisible = n;
                         this.satStatus[satID].y = conf.spacing + n * (conf.spacing + conf.contactBoxHeight);
                     } else {
                     	
                         hidden++;
                     }
                 }
                 
                 var visibleSatellitesCount = this.satOrder.length - hidden;
                 
                 hidden = 0;
                 
                 // TODO: DRY
                 for(var number = 0; number < this.gsOrder.length; number++) {
                     var gsID = this.gsOrder[number];
                     
                     if(this.gsStatus[gsID].visible) {
                         var n = number - hidden;
                         this.gsStatus[gsID].numberAmongVisible = n;
                         this.gsStatus[gsID].y = conf.timelineHeight + conf.spacing + n * (conf.spacing + conf.groundStationHeadingHeight + 
                                 visibleSatellitesCount * (conf.spacing + conf.contactBoxHeight));
                     } else {
                         hidden++;
                     }
                 }
                 
                 Arrays.forEach(this.gsOrder, Lang.hitch(this, function(gsID) {
                     Arrays.forEach(this.satOrder, Lang.hitch(this, function(satID) {
                         if(this.firstContacts[gsID][satID].contact != null && this.firstContacts[gsID][satID].contact.endTime <= this.startTime) {
                             this.firstContacts[gsID][satID].contact = null;
                             surface.remove(this.firstContacts[gsID][satID].shape);
                         }
                     }));
                 }));
             },
             
             placeAt: function(container) {
                 DomConstruct.place(this.mainContainer, container);
                 this.visible = true;
             }
        });
    }
);