define(["dojo/_base/declare", "dojo/dom-construct",
		"dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/layout/LayoutContainer",
		"dijit/form/DateTextBox", "dijit/form/Button", "dojo/on",
		"dojo/parser", "dijit/form/ValidationTextBox",
		"dijit/form/DropDownButton", "dijit/DropDownMenu", "dijit/MenuItem",
		"common/store/MissionInformationStore", "common/utils/DoIntersect",
		"dojo/_base/lang", "dojo/_base/array", "dijit/form/FilteringSelect",
		"common/store/ForEachStoreElement", "common/store/ArchiverStore",
		"dojo/store/Memory", "dojo/store/Observable", "dojo/request",
		"dijit/form/Form", "dojo/date",
        "./ContentProvider", "dijit/form/TextBox", "dijit/form/ComboBox",
		'dojo/dom-style', 'dijit/registry'],

function (declare, DomConstruct, BorderContainer, ContentPane, LayoutContainer, DateTextBox,
		Button, on, Parser, ValidationTextBox, DropDownButton, DropDownMenu,
		MenuItem, MissionInformationStore, CanSee, Lang, Arrays,
		FilteringSelect, ForEachStoreElement, ArchiverStore, Memory,
		Observable, request, Form,
		date, ContentProvider, TextBox, ComboBox, domStyle, registry) {
    return declare(ContentProvider, {

        name: "",
        startTimeValue: new Date(new Date().getTime()),
        endTimeValue: new Date(new Date().getTime() + 86400000),
            
        commonContentPane: new ContentPane({
            style: {
                margin: "0px",
                padding: "0px"
            }
        }),
        customContentPane: new ContentPane({
            id: "customArgumentsPane",
            style: {
                margin: "0px",
                padding: "0px"
            }
        }),
        buttonsContentPane: new ContentPane({
            id: "buttonsPane",
            style: {
                margin: "0px",
                padding: "0px",
                height: "35px"
                	
            }
        }),

        getContent: function (args) {

            form = new Form({
                id: "ParametersForm",
                encType: "multipart/form-data",
                action: ""
            });

            var tableNameStore = new Memory({
                data: [{
                    name: "AX25",
                    id: "AX25"
                }, {
                    name: "TNC",
                    id: "TNC"
                }, {
                    name: "Beacon",
                    id: "Beacon"
                }]
            });
            tableName = new FilteringSelect({
                name : "tableName",
                id : "tableName",
                placeHolder: "Select table for querying",
                store: tableNameStore,
                searchAttr: "name",
                required: true,
                value: "",
                onChange: function (value) {
                    self.updateCustomArgumentsPane(value);

                }
            }, "tableName");
            
            this.startTimeValue.setHours(0, 0, 0);
            this.endTimeValue.setHours(0, 0, 0);
            var self = this;

            var startDate = new DateTextBox({
                id: "startDate",
                class: "queryViewFilter",
                constraints: {
                    datePattern: 'yyyy-MM-dd'
                },
                value: this.startTimeValue,
                onChange: function (value) {
                	self.startTimeValue.setDate(value.getDate());
                	self.startTimeValue.setMonth(value.getMonth());
                	self.startTimeValue.setUTCFullYear(value.getUTCFullYear());
                }
            });

            var startTime = new ValidationTextBox({
                id : "startTime",
                value: "",
                placeHolder: "start time (HH:mm)",
                pattern: "([0-1][0-9]|[2][0-3])[:]([0-5][0-9])",
                style: {
                    width: "70px"
                },
                invalidMessage: "Use HH:mm format",
                onChange: function (value) {
                	self.startTimeValue.setHours(value.split(":")[0], value.split(":")[1], 0);
                }
            }, "startTime");

            var endDate = new DateTextBox({
                id: "endDate",
                class: "queryViewFilter",
                constraints: {
                    datePattern: 'yyyy-MM-dd'
                },
                value: this.endTimeValue,
                onChange: function (value) {
                	self.endTimeValue.setDate(value.getDate());
                    self.endTimeValue.setMonth(value.getMonth());
                    self.endTimeValue.setUTCFullYear(value.getUTCFullYear());

                }
            });
            var endTime = new ValidationTextBox({
                id : "endTime",
                value: "",
                placeHolder: "end time (HH:mm)",
                pattern: "([0-1][0-9]|[2][0-3])[:]([0-5][0-9])",
                invalidMessage: "Use HH:mm format",
                style: {
                    width: "70px"
                },
                onChange: function (value) {
                	self.endTimeValue.setHours(value.split(":")[0], value.split(":")[1], 0);
                }
            }, "endTime");


            var submitFilter = new Button({
                id: "submitFilter",
                class: "queryViewFilter",
                label: "Apply filter",
                position: "top"
            });

            var displayColumnsButton = new Button({
				id: "displayColumnsButton",
				class : "queryViewFilter",
				label : "Select Columns",
				style: {display: "none"}
			});
            
            var exportButton = new Button({
				id: "exportButton",
				class : "queryViewFilter",
				label : "Export to CSV",
				style: {display: "none"}
			});


            this.commonContentPane.addChild(tableName);
            this.commonContentPane.addChild(startDate);
            this.commonContentPane.addChild(startTime);
            this.commonContentPane.addChild(endDate);
            this.commonContentPane.addChild(endTime);
            this.buttonsContentPane.addChild(submitFilter);
            this.buttonsContentPane.addChild(displayColumnsButton);
            this.buttonsContentPane.addChild(exportButton);

            form.domNode.appendChild(this.commonContentPane.domNode);
            form.domNode.appendChild(this.customContentPane.domNode);
            form.domNode.appendChild(this.buttonsContentPane.domNode);

            return form;
        },

        updateCustomArgumentsPane: function (args) {
            if (args == "AX25") {
                if (this.name == "TNC"){
                    this.destroyTNCFields();
                    this.addAX25Fields();
                } 
                else if (this.name == "Beacon"){
                    this.customContentPane.destroyDescendants();
                    this.addAxAndTncFields();
                    this.addAX25Fields();
                }else{
                    this.addAxAndTncFields();
                    this.addAX25Fields();
                }
                this.name = "AX25";
            }
            else if (args == "TNC") {
                 if (this.name == "AX25"){
                    this.destroyAX25Fields();
                    this.addTNCFields();
                } 
                else if (this.name == "Beacon"){
                    this.customContentPane.destroyDescendants();
                    this.addAxAndTncFields();
                    this.addTNCFields();
                } else{
                    this.addAxAndTncFields();
                    this.addTNCFields();
                }
                this.name = "TNC";
            }
            else if (args == "Beacon") {
               this.customContentPane.destroyDescendants();
               this.addBeaconFields();
               this.name = "Beacon";
            }
        },

        addAxAndTncFields: function(){
			var satelliteStore =  new Memory({
				idProperty: "ID",
				data: MissionInformationStore.query( {class : "Satellite"} )
			});

			var satellite = new dijit.form.FilteringSelect({
                name : "satellite" ,
				id : dijit.registry.getUniqueId("satellite"),
				placeHolder : "Select a satellite",
				store : satelliteStore,
				searchAttr : "name",
				required : false
			}, "satellite");


			groundStationStore =  new Memory({
				idProperty: "ID",
				data: MissionInformationStore.query( {
					class : "GroundStation"
				} )
			});

			var groundStation = new dijit.form.ComboBox({
                name : "groundStation" ,
				id : dijit.registry.getUniqueId("groundStation"),
				placeHolder : "Select a ground station",
				store: groundStationStore,
				searchAttr : "name",
			}, "groundStation");
			
			var directionStore = new Memory({
				data : [ {
					name : "none",
					id : ""
				},{
					name : "UP",
					id : "UP"
				}, {
					name : "DOWN",
					id : "DOWN"
				} ]
			});
			var direction = new FilteringSelect({
                name : "direction" ,
				id : dijit.registry.getUniqueId("direction"),
				placeHolder : "Select a direction",
				store : directionStore,
				searchAttr : "name",
				required : false

			}, "direction");

			this.customContentPane.addChild(direction);
			this.customContentPane.addChild(satellite);
			this.customContentPane.addChild(groundStation);
		},

		addAX25Fields : function(cp) {
			
			var orbitRange = new ValidationTextBox({
                name : "orbitRange" ,
				id : "orbitRange",
				value : "",
				placeHolder : "orbit range (min/max)",
				required : false,
				pattern: "[-]*(\\d+)[/][-]*(\\d+)",
				invalidMessage: "Use minValue/maxValue format"

			}, "orbitRange");

			var subSystemStore = new Memory({
				data : [ {
					name : "none",
					id : ""
				},{
					name : "EPS",
					id : 00
				}, {
					name : "COM",
					id : 01
				}, {
					name : "CDHS",
					id : 02
				}, {
					name : "ADCS",
					id : 03
				}, {
					name : "PL",
					id : 04
				}, {
					name : "CAM",
					id : 05
				}, {
					name : "GS",
					id : 06
				}, {
					name : "PC",
					id : 07
				}, {
					name : "PC2",
					id : 08
				} ]
			});

			var subSystem = new dijit.form.FilteringSelect({
                name : "subSystem" ,
				id : "subSystem",
				placeHolder : "Select a subsystem",
                value: "",
				searchAttr : "name",
				store : subSystemStore,
				required : false
			}, "subSystem");


			this.customContentPane.addChild(orbitRange);
			this.customContentPane.addChild(subSystem);

		},
        destroyAX25Fields: function(){
            dijit.byId("orbitRange").destroy();
            dijit.byId("subSystem").destroy();
        },
		addTNCFields : function (){
			
			var orbitRange = new ValidationTextBox({
                name : "orbitRange" ,
				id : "orbitRange",
				value : "",
				placeHolder : "orbit range (min/max)",
				required : false,
				patter: "[-]*(\\d+)[/][-]*(\\d+)",
				invalidMessage: "Use minValue/maxValue format"

			}, "orbitRange");

			this.customContentPane.addChild(orbitRange);
			
		},
        destroyTNCFields: function(){
            dijit.byId("orbitRange").destroy();
        },
         addBeaconFields: function(){

             var insertedBy = new TextBox({
            	 name: "insertedBy",
            	 id: "insertedBy",
            	 value: "",
            	 placeHolder: "Inserted by"
             }, "insertedBy");
        	 
        	 var issuedBy = new TextBox({
            	 name: "issuedBy",
            	 id: "issuedBy",
            	 value: "",
            	 placeHolder: "Issued by"
             }, "issuedBy");

 			this.customContentPane.addChild(issuedBy);
 			this.customContentPane.addChild(insertedBy);

        },
    })

})
            
            