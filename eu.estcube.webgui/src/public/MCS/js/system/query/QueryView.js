define(["dojo/_base/declare", "dojo/dom-construct",
		"dijit/layout/BorderContainer", "dijit/layout/ContentPane", 
	    "dgrid/OnDemandGrid",
	    "dojox/layout/TableContainer",
		"dijit/form/DateTextBox", 
		"dijit/form/Button", 
		"dijit/form/CheckBox",
		"dijit/Tooltip",
		"dojo/on",
		"dojo/parser", "dijit/form/ValidationTextBox",
		"dijit/form/DropDownButton", "dijit/DropDownMenu", "dijit/MenuItem",
		"common/store/MissionInformationStore", 
	    "dgrid/extensions/DijitRegistry",
		"dojo/_base/lang", "dojo/_base/array", "dijit/form/FilteringSelect",
		"common/store/ForEachStoreElement", "common/store/ArchiverStore",
		"dojo/store/Memory", "dojo/store/Observable", "dojo/request",
		"dijit/form/Form", "dojox/grid/DataGrid", "config/config",
		"common/display/QueryContentProvider", "dijit/form/TimeTextBox", "dojo/date",
		"common/display/QueryParametersProvider", "dijit/Dialog",
		"dojo/dom-style", "dijit/registry", "dojo/domReady!",  ],
		
function(declare, DomConstruct, BorderContainer, ContentPane, Grid, TableContainer, DateTextBox,
		Button, CheckBox, Tooltip, on, Parser, ValidationTextBox, DropDownButton, DropDownMenu,
		MenuItem, MissionInformationStore, DijitRegistry, Lang, Arrays,
		FilteringSelect,  ForEachStoreElement, ArchiverStore, Memory,
		Observable, request, Form, DataGrid, Config, QueryContentProvider,
		TimeTextBox, date, QueryParametersProvider, Dialog, domStyle, registry) {
	var form;
	
	return declare([], {
		
		placeAt : function(container) {
			DomConstruct.place(this.mainContainer, container);
		},
		
		getGridStructure: function(tableName){
			if (tableName == "TNC"){
				if (tncTable.length == 0){
					tncTable = [{
						name : "ID",
						field : "id",
						width: "50px",
						displayed: true

					},
					{
						name : "Reception Time",
						field : "receptionTime",
						width: "180px",
						displayed: true
					},
					{
						name : "Type",
						field : "direction",
						width: "60px",
						displayed: true
					},
					{
						name : "Satellite",
						field : "satellite",
						width: "80px",
						displayed: true
					},
					{
						name : "Target",
						field : "target",
						width: "100px",
						displayed: true
					},
					{
						name : "Orbit",
						field : "orbit",
						width: "80px",
						displayed: true
					},
					{
						name : "Data",
						field : "data",
						width: "640px",
						displayed: true
					},
					{
						name : "Created",
						field : "created",
						width: "250px",
						displayed: true
					}
					];
					return tncTable;
				} 
				else return tncTable;
			}
			if (tableName == "AX25"){
				if (ax25Table.length == 0){
					ax25Table = [
							{
								name : "ID",
								field : "id",
								width: "50px",
								displayed: true

							},
							{
								name : "Reception Time (UTC)",
								field : "receptionTime",
								width: "150px",
								displayed: true
							},
							{
								name : "Type",
								field : "direction",
								width: "80px",
								displayed: true
							},
							{
								name : "Satellite",
								field : "satellite",
								width: "85px",
								displayed: true
							},
							{
								name : "Destination",
								field : "destAddr",
								width: "120px",
								displayed: true
							},
							{
								name : "Source",
								field : "srcAddr",
								width: "140px",
								displayed: true
							},
							{
								name : "Target",
								field : "target",
								width: "100px",
								displayed: true
							},
							{
								name : "Orbit",
								field : "orbitNumber",
								width: "80px",
								displayed: true
							},
							{
								name : "Pid",
								field : "pid",
								width: "30px",
								displayed: true
							},
							{
								name : "Ctrl",
								field : "ctrl",
								width: "30px",
								displayed: true
							},
							{
								name : "Fcs",
								field : "fcs",
								width: "30px",
								displayed: true
							},
							{

								name : "Data",
								field : "info",
								width: "350px",
								displayed: true
							},
							{

								name : "errorBitmask",
								field : "errorBitmask",
								width: "50px",
								displayed: true
							},
							{
								name : "Created Time (local)",
								field : "created",
								width: "250px",
								displayed: true
							}

						];
	
						
					return ax25Table;	
				}else return ax25Table;
				
			}
			
			if (tableName == "Beacon"){
				if (beaconTable.length == 0){
					beaconTable = [
									
									{
										name : "Issued By",
										field : "issuedBy",
										width: "100px",
										displayed: true
									},    
									{
										name : "Raw value",
										field : "value",
										width: "430px",
										displayed: true

									},
									{
										name : "Version",
										field : "version",
										width: "100px",
										displayed: true
									},    
									{
										name : "Reception Time",
										field : "timestamp",
										width: "150px",
										displayed: true
									},
									{
										name : "Inserted By",
										field : "insertedBy",
										width: "100px",
										displayed: true
									},  
							];
						
					return beaconTable;	
				}
				else return beaconTable;
				
			}			
		},
		
        makeGrid : function() {
        	
        	self = this;       	
        	
			columns = self.getGridStructure(tableName.value);
			
			columnsInGrid = [];
			Arrays.some(columns, function (entry) {
				if(entry.displayed){
					columnsInGrid.push(entry);
				}
			});
			content = new QueryContentProvider({
					structure: columnsInGrid
				});
			gridPane.destroyDescendants();
			grid = content.getContent();
			
			grid.on("RowClick", function(evt){
			    var idx = evt.rowIndex;
		        var row = grid.getItem(idx);
				if (row.hasOwnProperty("value") == true){
					var myDialog = dijit.byId('myDialog');
					if(!myDialog){
					    myDialog = new dijit.Dialog({
					        id:'myDialog',
					        title: 'Beacon Details',
				        	style:'width:600px; height:500px;',
					    });
					}
					myDialog.show();

					
			       request.post(Config.BEACON.CHECK_URL, {
		               data: {
		                   source: row.issuedBy,
		                   insertedBy: row.insertedBy,
		                   datetime: row.timestamp,
		                   data: row.value
		               },
		               handleAs: "json"
		           }).then(function(data) {
		        	   var fields = [];
	                   for(key in data) {
	                       if(config.ESTCube1_BEACONS.hiddenFields.indexOf(key) == -1) {
	                    	   fields.push(data[key]);
	                       }
	                   }
	                   
	                   var memory = new dojo.store.Memory({data: fields});
						
				       var detailsGrid= new DataGrid({
				        	class: "detailsGrid",
				        	store:  new dojo.data.ObjectStore({objectStore:memory}),  
				    	   structure: [
				                       {
				                           name: "Name",
				                           field: "name",
				                           width: "170px"
				                       },
				                       
				                       {
				                           name: "Value",
				                           field: "value"
				                       },
				                       
				                       {
				                           name: "Unit",
				                           field: "unit"
				                       },
				                       
				                       {
				                           name: "Description",
				                           field: "description",
				                           width: "190px"
				                       }
				                   ]
				               }, "detailsGrid");
						
	                   dojo.place(detailsGrid.domNode,myDialog.containerNode,'first');
	 				   
	                   detailsGrid.startup();
	               }),
	               
	               function(error) {
	                   console.error(error);
	               }
   			};

	              
	        });
			 
			gridPane.addChild(grid);
			grid.startup();
		},
		
		getIdByValue : function(arr, value) {
			item = -1;
			for (i = 0; i < arr.length; i++){
			//Arrays.some(arr, function (entry) {

				if (arr[i].name == value) {
					item = i;
					return i;
				}
		  }
			return item;
		},
		
		constructor : function(args) {
			self = this;

			tncTable = [];
			ax25Table = [];
			beaconTable = [];
			this.mainContainer = DomConstruct.create("div", {
				style : {
					width : "100%",
					height : "100%"
				}
			});
			
			gridPane = new ContentPane({
				id : "gridPane",
				style : {
					region: "center",
					height : "80%"
				}
			});
			
			paramsPane = new ContentPane({
				id : "paramsPane",
				style : {
					width : "100%",
					height: "80px",
					region: "top",
				}
			});
			
            var provider = new QueryParametersProvider({});
            var form = provider.getContent();
            paramsPane.addChild(form);
            
            ArchiverStore.notif = function(str) {
    			var node = dijit.byId("submitFilter").domNode;
    			if (str == undefined) {
    				Tooltip.hide(node);
    			} else {
    				Tooltip.show(str, node);
    			}
    		};

            ArchiverStore.onRequestComplete = function() {
                domStyle.set(dijit.byId("gridPane").domNode, 'display', '');
               	domStyle.set(registry.byId("exportButton").domNode, 'display', 'inline');
               	domStyle.set(registry.byId("displayColumnsButton").domNode, 'display', 'inline'); 
                ArchiverStore.notif();
            	self.makeGrid();
            };
            
            on(dijit.byId("submitFilter"), "click", Lang.hitch(this, function () {
                requestId = Math.floor(Math.random() * 1000000000000);
                ArchiverStore.requestId = requestId;
                domStyle.set(dijit.byId("gridPane").domNode, 'display', 'none');
               	domStyle.set(registry.byId("exportButton").domNode, 'display', 'none');
               	domStyle.set(registry.byId("displayColumnsButton").domNode, 'display', 'none'); 
                request.get(config.SUBMIT_URL, {
                    query: form.get("value"),
                    headers: {
                        startDate: provider.startTimeValue.getTime(),
                        endDate: provider.endTimeValue.getTime(),
                        requestId: requestId
                    },
                    handleAs: 'json'
                }).then(function (response) {
                    ArchiverStore.data = [];
                    if (response.status == "ok") {
                        ArchiverStore.notif("Request sent. Waiting for response...");
                    }else if (response.status == "error") {
                    	ArchiverStore.notif("Error sending request");
                    }else{
                    	ArchiverStore.notif("Request not sent");
                    }
                });
              }));

              
            on(dijit.byId("displayColumnsButton"), "click", Lang.hitch(this, function() {
            	var columnsDialog = dijit.byId('columnsDialog');
				if(!columnsDialog){
					columnsDialog = new dijit.Dialog({
				        id:'columnsDialog',
				        title: 'Show columns',
			        	style:'width:200px; height:300px;',
				    });
				}
				columnsDialog.show();
				var checkboxTable = dijit.byId('checkboxTable');
				if(checkboxTable){
					checkboxTable.destroyRecursive();
					
				}
				checkboxTable = new TableContainer({
					id : "checkboxTable",
					orientation: "horiz",
					cols: 1,
				});
				
	//			newColumns = [];
				
				
				Arrays.some(columns, function (entry) {
					
					var checkBox = new CheckBox({
				        name: "checkBox",
				        label: entry.name,
				        checked: entry.displayed,
				        onChange: function(b){ 
				        	if(this.get("value") == false){
				        		item = self.getIdByValue(columnsInGrid, this.get("label"));
				        		if (item != null && item != -1)
				        			columnsInGrid.splice(item, 1);
				        			columns[self.getIdByValue(columns, this.get("label"))].displayed = false;
				        	}
				        	else if(this.get("value") == "on"){
				        		item = self.getIdByValue(columns, this.get("label"));
				        		if (item != null && item != -1)
				        			columnsInGrid.push(columns[item]);
				        			columns[item].displayed = true;
				        	}
				        	
				        	dijit.byId("Enhanced-grid-query").set("structure", columnsInGrid);
				        	
				        }
				    }, "checkBox");
//					if (entry.displayed){
//						newColumns.push(entry);
//					}
					checkboxTable.addChild(checkBox);
					checkBox.startup();
					
				});
                dojo.place(checkboxTable.domNode, columnsDialog.containerNode,'first');

				checkboxTable.startup();
			}));
            
            on(dijit.byId("exportButton"), "click", Lang.hitch(this, function() {
				dijit.byId("Enhanced-grid-query").exportGrid("csv", {writerArgs: {separator:";"}}, function(str){
					console.error(str);
					var csvContent = str;
					//var encodedUri = encodeURI(csvContent);
					var blobdata = new Blob([csvContent],{type : 'text/csv'});
					var a = document.getElementById("csv");
					if(!a){
						a = document.createElement('a');
						a.id = "csv";
					}
					if(typeof a.download != "undefined")
					{

						a.href        = window.URL.createObjectURL(blobdata);
						a.target      = "_blank";
						var startDate = dijit.byId("startDate").value;
						var startDateString = startDate.getDate() + "." + (startDate.getMonth() + 1) + "." +  startDate.getFullYear();
						var endDate = dijit.byId("endDate").value;
						var endDateString = endDate.getDate() + "." + (endDate.getMonth() + 1)  + "." +  endDate.getFullYear();
				
						a.download    = tableName.value + "_" + startDateString + "-" + endDateString + ".csv";

						document.body.appendChild(a);
						a.click();


					}
				})
			}));
            
            
			this.bc = new BorderContainer({}, this.mainContainer);
			this.bc.addChild(paramsPane);
			this.bc.addChild(gridPane);
			this.bc.startup();
		}
	});
});
