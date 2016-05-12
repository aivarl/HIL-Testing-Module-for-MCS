define([
    "dojo/_base/array",
    "dojo/store/Memory",
    "dojo/store/Observable",
    "dojo/topic",
    "common/messages/SystemMessage",
    "config/config",
    "./DataHandler",
    "./StoreIdGenerator",
    "./StoreLimitHandler",
    "./StoreMonitor",
    ],

    function(Arrays, Memory, Observable, Topic, SystemMessage, Config, DataHandler, IdGenerator, StoreLimitHandler, StoreMonitor) {

        var channel = Config.WEBSOCKET_TRANSPORT;
        var storeId = "storeId";

        var store = new Observable(new Memory({ idProperty: storeId }));
        new StoreMonitor({ store: store, storeName: "TransportFrameStore" });

        // stats storage
        store.receiverIDs = [];
        store.uplinkFrameCounts = [];
        store.downlinkFrameCounts = [];
        store.totalUplinkCount = 0;
        store.totalDownlinkCount = 0;
        
        
        var handler = new DataHandler({ channels: [channel], callback: function(message, channel) {
            // accept only messages where headers["class"] value is in the list Config.TRANSPORT_FRAME_FILTER
            // discard all others
            if (message.headers && Arrays.indexOf(Config.TRANSPORT_FRAME_FILTER, message.headers["class"]) > -1) {
                message.storeId = dojox.uuid.generateRandomUuid();
                if(message.headers.type === "AX.25" && (typeof message.frame.srcAddr == "undefined" || typeof message.frame.destAddr == "undefined")) {
                    Topic.publish(Config.TOPIC_SYSTEM_MESSAGES, new SystemMessage({
                        value: "Invalid AX.25 frame received. Possible cause: partial TNC frame.",
                        level: "WARN"
                    }));
                    
                }
                
                // For debugging
                // console.log(message);
                
            	// FRAME STATISTICS
                // count only ax25 packets
                if (message.headers.class == "Ax25UIFrame") {
                	// create station id
                	var tncPort = message.headers.tncPort;
                	var receiverID = message.headers.groundStationId;
                	if (receiverID == undefined) {
                		receiverID = message.headers.issuedBy;
                	}
                	
                	if (tncPort == undefined) {
                		for (var i = 0; i < store.receiverIDs.length; i++) {
                			if (store.receiverIDs[i].indexOf(receiverID) == 0) {
                				receiverID = store.receiverIDs[i];
                				break;
                			}
                		}
                	}
                	else {
                		receiverID = receiverID + "." + tncPort;
                	}
                	
                    // get array index of the ground station
	                var i = Arrays.indexOf( store.receiverIDs, receiverID );
	        		
	    			// New Receiver
	    			if (i == -1) {
	    				i = store.receiverIDs.length;
	    				store.receiverIDs[i] = receiverID;
	    				store.uplinkFrameCounts[i] = 0;
	    				store.downlinkFrameCounts[i] = 0;
	    			}
	
	    			if (message.headers.communicationLinkType == "Uplink") {
	    				store.uplinkFrameCounts[i]++;
	    				store.totalUplinkCount++;
	    			}
	    			else if (message.headers.communicationLinkType == "Downlink"){
	    				store.downlinkFrameCounts[i]++;
	    				store.totalDownlinkCount++;
	    			}
	    			else {
	    				console.log( "--- ERROR: Unknown communicationLinkType '" + message.headers.communicationLinkType + "'" );
	    			}
                } //AX.25
                
    			// Puts the frames to the store after the javascript execution stack is ended
    			setTimeout(function() {
        			// Add frame to store
        			StoreLimitHandler.put(store, IdGenerator.generate(message, storeId), Config.STORE_LIMIT_TRANSPORT_FRAMES);
    			}, 0);
            }
        }});

        return store;
    }
);