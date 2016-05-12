define([
    "dojo/_base/declare", 
    "dojo/_base/lang", 
    "dojo/_base/array", 
    "dgrid/Grid",
    "./ContentProvider", 
    "common/store/TransportFrameStore",
    ], 
    function(declare, Lang, Arrays, Grid, ContentProvider, TransportFrameStore) {
    	
    	var statsGrid;
    	    	
        return declare(ContentProvider, {        
           	grid: statsGrid,
                     
            getContent: function (args) {
                declare.safeMixin(this, args);
                statsGrid = new Grid({
                    id: null,
                    class: "frame-stats-grid",
                    columns: {
                        GS: {
                            label: "Ground Station",
                            className: "frame-stats-gs",
                        },
                        downlinkCount: {
                            label: "DL Count",
                            className: "frame-stats-downlinkCount",
                        },
                        downlinkRatio: {
                        	label: "DL %",
                        	className: "frame-stats-downlinkRatio",
                        },
                        uplinkCount: {
                            label: "UL Count",
                            className: "frame-stats-uplinkCount",
                        },
                        uplinkRatio: {
                        	label: "UL %",
                        	className: "frame-stats-uplinkRatio",
                        },
                    },
                });
                
                
                // update data
                var queryResults = TransportFrameStore.query();
                queryResults.observe( function(obj, oldIndex, newIndex) {
                	// Create compound array for grid display
                	var tempArray = [];
                	var totalUplinkCount = TransportFrameStore.totalUplinkCount;
                	var totalDownlinkCount = TransportFrameStore.totalDownlinkCount;
                	var receiverIDs = TransportFrameStore.receiverIDs;
                	var uplinkCounts = TransportFrameStore.uplinkFrameCounts;
                	var downlinkCounts = TransportFrameStore.downlinkFrameCounts;
                	
                	// create grid row for total count
                	tempArray[0] = { GS:"Total",
                					 downlinkCount: totalDownlinkCount, downlinkRatio: "",
                					 uplinkCount: totalUplinkCount, uplinkRatio: "" };
                	
                	// loop through all receivers
                	for (var i = 0; i < receiverIDs.length; i++) {
                		// Calculate ratios
                		downlinkRatio = 0.0;
                		uplinkRatio = 0.0;
                		if (totalDownlinkCount > 0) {
                			downlinkRatio = Math.round( downlinkCounts[i] / totalDownlinkCount * 10000.0 ) / 100.0;
                		}
                		if (totalUplinkCount > 0) {
                			uplinkRatio = Math.round( uplinkCounts[i] / totalUplinkCount * 10000.0 ) / 100.0;
                		}
                		
                		// Remove spam from receiver ID
                		tempGSID = receiverIDs[i].split("/");
                		tempGSID = tempGSID[tempGSID.length-1];
                		
                		// create array for grid rendering
                		tempArray[tempArray.length] = { GS:tempGSID,
                						 downlinkCount:downlinkCounts[i], downlinkRatio:downlinkRatio,
                						 uplinkCount:uplinkCounts[i], uplinkRatio:uplinkRatio };
                	}

					statsGrid.refresh(); // removes all old data from grid
					statsGrid.set( "showHeader", true );
                	statsGrid.renderArray(tempArray);
                }, true );
                
                
				return statsGrid;
            },

            startup: function() {
  				statsGrid.startup();
            },
            
        });
    });
    



