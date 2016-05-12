// Provides observer service for all time-related data

define([
	"dojo/_base/declare",
	"common/store/MissionInformationStore"
	],

	function (declare, MissionInformationStore) {

		var aosTimeListeners = new Array();			// notified when next AOS time changes
		var losTimeListeners = new Array();			// notified when next LOS time changes
		var aosIntervalListeners = new Array();		// notified each timestep with time to next AOS
		var losIntervalListeners = new Array();		// notified each timestep with time to next LOS
		var aosLosIntervalListeners = new Array();	// notified each timestep with time to next AOS or LOS whichever is earlier
		var clockListeners = new Array();			// notified each timestep with current time
		// event listeners can also be added to be notified at the time of a specific event

		var nextAOS = 0;	// next AOS time, unix timestamp milliseconds
		var nextLOS = 0;	// next LOS time, unix timestamp milliseconds
		var timeToAOS = 0;	// time to next AOS, milliseconds
		var timeToLOS = 0;	// time to next LOS, milliseconds

		var qOptions = {sort: [{attribute: "startTime", descending: false}] };
		var contactResults = MissionInformationStore.query( {class: "LocationContactEvent", groundStationId: MissionInformationStore.getGroundStation().ID }, qOptions );
		contactResults.observe( updateContacts, true );


		// Callback function for store observer
		function updateContacts( alteredObject, removedFrom, instertedInto ) {
			// nothing to do here at the moment
		}


		// Updates event times and intervals
		// currentTime - timestamp in milliseconds (eg. new Date().getTime() )
		function updateTimes( currentTime ) {
			for (var i in contactResults) {
				var contact = contactResults[i];

				// update AOS event time
				if (	(nextAOS < currentTime && contact.startTime > currentTime) ||
						(contact.startTime > currentTime && contact.startTime < nextAOS) ) {
					nextAOS = contact.startTime;
				}
				if (nextAOS < currentTime) nextAOS = -1;	// if next AOS was not found set nextAOS to indicate error

				// update LOS event time
				if (	(nextLOS < currentTime && contact.endTime > currentTime) ||
						(contact.endTime > currentTime && contact.endTime < nextLOS) ) {
					nextLOS = contact.endTime;
				}
				if (nextLOS < currentTime) nextLOS = -1;	// if next LOS was not found set nextLOS to indicate error
			}

			timeToAOS = nextAOS - currentTime;
			timeToLOS = nextLOS - currentTime;
		}



		// Add a new listener
		// parentObject - owner of the callback function
		// callback function must accept two arguments: String eventName and int eventTime (milliseconds)
		this.addListener = function (/*array*/ eventTypes, /*object*/ parentObj, /*function*/ callbackFun) {
			// Check for errors
			if (typeof(parent) != 'object' || typeof(callbackFun) != 'function') {
				alert( "--- ERROR ---\n\nTimeFactory.addListener called with arguments of types '" +
										typeof parent + "' and '" + typeof callbackFun + "'\n" );
				return;
			}

			var listener = {parent: parentObj, callback: callbackFun};

			// add listeners
			for( var i in eventTypes ) {
				switch (eventTypes[i]) {
					case 'clock':
						clockListeners.push( listener );
						break;

					case 'aosTime':
						aosTimeListeners.push( listener );
						break;

					case 'losTime':
						losTimeListeners.push( listener );
						break;

					case 'aosInterval':
						aosIntervalListeners.push( listener );
						break;

					case 'losInterval':
						losIntervalListeners.push( listener );
						break;

					case 'aosLosInterval':
						aosLosIntervalListeners.push( listener );
						break;

					default:
						alert( "--- ERROR ---\n\nTrying to add TimeFactory listener to an unknown event '"
								+ eventTypes[i] + "'" );
				}
			}
		}



		// Send updated data to listeners
		// bool xxxTimeChanged -  if true that event time listeners will be notified in addition to interval listeners
		function notifyListeners( currentTime, aosTimeChanged, losTimeChanged ) {
			var i;

			for (i in clockListeners) {
				clockListeners[i].callback( "Clock", currentTime );
			}
			for (i in aosIntervalListeners) {
				aosIntervalListeners[i].callback( "AOS", timeToAOS );
			}
			for (i in losIntervalListeners) {
				losIntervalListeners[i].callback( "LOS", timeToLOS );
			}

			if (nextAOS < nextLOS) {
				for (i in aosLosIntervalListeners) aosLosIntervalListeners[i].callback( "AOS", timeToAOS );
			}
			else {
				for (i in aosLosIntervalListeners) aosLosIntervalListeners[i].callback( "LOS", timeToLOS );
			}

			if (aosTimeChanged) {
				for (i in aosTimeListeners) aosTimeListeners[i].callback( "AOS", nextAOS );
			}
			if (losTimeChanged) {
				for (i in losTimeListeners) losTimeListeners[i].callback( "LOS", nextLOS );
			}
		}


		// var startTime = new Date().getTime();						// FOR DEBUGGING
		// var reqTime = new Date("2013-06-01 00:11:20").getTime();		// FOR DEBUGGING
		// var timeDiff = startTime - reqTime;							// FOR DEBUGGING

		// start timer to update times
		this.timerId = window.setInterval(
			function() {
				var oldAOS = nextAOS;
				var oldLOS = nextLOS;

				// var currentTime = new Date().getTime() - timeDiff;	// FOR DEBUGGING
				var currentTime = new Date().getTime();
				updateTimes( currentTime );

				var aosChanged = nextAOS != oldAOS;
				var losChanged = nextLOS != oldLOS;

				notifyListeners( currentTime, aosChanged, losChanged );
			},
			1000
		);

		return this;
	}
);
