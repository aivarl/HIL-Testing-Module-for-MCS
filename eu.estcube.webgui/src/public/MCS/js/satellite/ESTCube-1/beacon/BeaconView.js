define([
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dojo/_base/lang",
    "dojo/on",
    "dijit/form/Form",
    "dijit/form/Button",
    "dijit/form/ValidationTextBox",
    "dijit/form/SimpleTextarea",
    "dijit/layout/ContentPane",
    "dojox/layout/TableContainer",
    "dgrid/OnDemandGrid",
    "dojo/data/ItemFileWriteStore", // REMOVE!
    "dojo/json",
    "config/config",
    "dojo/request",
    "common/formatter/DateFormatter",
    "common/store/BeaconStore",
    "common/store/GetUserInformation",
    "dojo/date/locale"
   ],

    function(declare, Dom, DomClass, DomConstruct, DomStyle, Lang, On, Form, Button, ValidationTextBox, SimpleTextarea, 
            ContentPane, TableContainer, Grid, ItemFileWriteStore, Json, Config, Request, DateFormatter, BeaconStore, GetUserInformation, Locale ) {

        return declare([], {

            constructor: function(args) {

                var self = this;

                GetUserInformation(Lang.hitch(this, function (userInfo) {
                    this.userInfo = userInfo;
                 }));
			 
                // ------------------------------------------
                // create form
                this.main = DomConstruct.create("div", { "class": "beacon-container", "style": "width:720px; margin:10px;" });
                this.formWrapperDiv = DomConstruct.create("div", { "style":"width:700px;"},  this.main);
                this.div = DomConstruct.create("div", {},  this.formWrapperDiv);
                this.form = new Form({ encType: "multipart/form-data", action: "", method: "" }, this.div);
                this.table = new TableContainer({cols: 2, labelWidth: 150 });

                this.beaconSourceValue = new ValidationTextBox({
                    name: "beaconSource",
                    value: "",
                    placeHolder: "Input name or callsign",
                    label: "Received by:",
                    required:true,
                    onChange: function() {
                        self.hideResponseElements();
                    }
                });
                this.beaconDateTimeValue = new ValidationTextBox({
                    name: "beaconDateTime",
                    label: "Datetime:",
                    placeHolder: "YYYY-MM-DD HH:MM:SS",
                    value:"",
                    required:false,
                    regExp: "\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}",
                    promptMessage: "Date format is YYYY-MM-DD HH:MM:SS",
                    onChange: function() {
                        self.hideResponseElements();
                    }
                });
                this.beaconData = new ValidationTextBox({
                    name: "beaconData",
                    value:"",
                    label: "CW Message:",
                    placeHolder: "ASCII string",
                    required: true,
                    colspan: 2,
                    style:"width:528px",
                    promptMessage: "Unknown symbols replace with #",
                    onChange: function() {
                        self.hideResponseElements();
                    }
                });

                this.checkButtonSubmit = new Button({ label: "View parameters", title: "Check beacon message" });
                On(this.checkButtonSubmit, "click", function() {
                    self.checkBeaconData();
                });

                this.buttonWrapper = new ContentPane({ style: "margin: 0px; padding: 0px;" });
                this.buttonWrapper.addChild(this.checkButtonSubmit);


                this.table.addChild(this.beaconData);
                this.table.addChild(this.beaconSourceValue);
                this.table.addChild(this.beaconDateTimeValue);
                this.table.addChild(this.buttonWrapper);
                this.form.domNode.appendChild(this.table.domNode);
                this.table.startup();


                // ------------------------------------------
                // create response grid and buttons.

                this.responseDiv = DomConstruct.create("div", { "class": "beacon-result-div" }, this.main);
                this.beaconTitle = DomConstruct.create("div", {style:'font-size:15px; font-weight:bold'}, this.responseDiv );

                this.buttonSubmit = new Button({ label: "Send", title: "Send", style:"float:right" });
                On(this.buttonSubmit, "click", function() {
                    self.submitBeaconData();
                });

                this.buttonCancel = new Button({ label: "Cancel", title: "Cancel", style:"float:left" });
                On(this.buttonCancel, "click", function() {
                     self.hideResponseElements();
                });
                this.hideResponseElements();

                this.buttonWrapper2 = new ContentPane({ style: "margin: 0px; padding: 0px;" });
                this.buttonWrapper2.addChild(this.buttonSubmit);
                this.buttonWrapper2.addChild(this.buttonCancel);
                this.buttonWrapper2.placeAt( this.responseDiv );
                
                
                this.grid = new Grid({
                    columns: [
                        {   label: "Name",
                            field: "name",
                            formatter: function( value ) {
                                value = value.replace( Config.BEACON.prefix, "" ).replace( ".", " " ).replace( ".", " " ).replace( ".", " " );
                                value = value.charAt(0).toUpperCase() + value.slice(1);
                                return value;
                            },
                            className: "field-name"
                        },
                        {   label: "Value",
                            field: "value",
                            formatter: function( value ) {
                                if( !isNaN(parseFloat(value)) && isFinite(value) ) { // is number
                                    return Math.round( value*1000 )/1000;
                                } else {
                                    return value;
                                }
                            },
                            className: "field-medium-value"
                        },
                        { label: "Unit", field: "unit", className: "field-unit" },
                        { label: "Description", field: "description", className: "field-description" }
                    ]
                });

                DomClass.add(this.grid.domNode, "beacon-grid");
                this.responseDiv.appendChild( this.grid.domNode );

                

                var sampleMessage = "<b>Sample safe mode radio beacon message:</b> ES5E/S T TASAZZZ AT DA TT T6SN ZZ 6B TD 5B AB TC FF UE ZU B U WB NC SW KN<br />"
                 sampleMessage += "<b>Sample normal mode radio beacon message:</b> ES5E/S ETASA ZZZZZ ZUABTCFFHTUS5BSNMFNFCAFE6HK"
                 DomConstruct.create( "div", {style:"color:lightgray; margin-top:10px", innerHTML:sampleMessage}, this.main );


            },





            checkBeaconData: function() {
                var self = this;
                if (this.form.validate()) {

                    Request.post(Config.BEACON.CHECK_URL, {
                        data: {
                            source: this.beaconSourceValue.get('value'),
                            datetime: this.beaconDateTimeValue.get('value'),
                            data: this.beaconData.get('value'),
                            insertedBy: this.userInfo.username
                        },
                        handleAs: "json"
                    }).then(
                        Lang.hitch(this, this.onCheckSuccess),
                        Lang.hitch(this, this.onCheckError)
                    );

                } else {
                    alert("Invalid data! Fix errors and resubmit!");
                }

            },

            onCheckSuccess: function( jsonData ) {
                if( typeof jsonData == "object" ) {
                    var data = [];
                    for( var i in jsonData ) {
                        if( jsonData[i].name == Config.BEACON.specialParameters.string 
                        ||  jsonData[i].name == "raw Metadata") {

                        } else if( jsonData[i].name == Config.BEACON.specialParameters.operatingMode ) {
                            if( jsonData[i].value == "T") {
                                this.beaconTitle.innerHTML = "Safe mode beacon parameters "+DateFormatter( jsonData[i].timestamp )+" by "+jsonData[i].issuedBy;
                               } else if( jsonData[i].value == "E") {
                                   this.beaconTitle.innerHTML = "Normal mode beacon parameters "+DateFormatter( jsonData[i].timestamp )+" by "+jsonData[i].issuedBy;
                               }
                        } else {
                            data.push( jsonData[i] );
                        }
                    }
                    this.grid.refresh();
                    this.grid.renderArray( data);
                    this.showResponseElements();
                } else {
                    alert(jsonData);
                }

            },

            onCheckError: function( error ) {
                alert( error );
            },

            submitBeaconData: function() {

                var self = this;
                if (this.form.validate()) {

                    self.buttonSubmit._setDisabledAttr(true);
                    
                    var beaconRequest = {
                        source: this.beaconSourceValue.get('value'),
                        datetime: this.beaconDateTimeValue.get('value'),
                        data: this.beaconData.get('value'),
                        insertedBy: this.userInfo.username
                        
                    };

                    Request.post(Config.BEACON.SUBMIT_URL, {
                        data: beaconRequest,
                        handleAs: "json"
                    }).then(
                        Lang.hitch(this, function(response) { this.onSubmitSuccess(response, beaconRequest) }),
                        Lang.hitch(this, this.onSubmitError)
                    );

                } else {
                    alert("Invalid data! Fix errors and resubmit!");
                }

            },

            onSubmitSuccess: function( response, beaconRequest ) {
                alert( response.message );
                
                if(response.status == "ok") {
                    BeaconStore.put({
                        timestamp: Locale.parse(beaconRequest.datetime, {
                            selector: "date",
                            datePattern: Config.DEFAULT_DATE_FORMAT_NO_MS
                        }).getTime(),
                        issuedBy: beaconRequest.source,
                        value: beaconRequest.data.replace(/ /g, ''),
                        insertedBy: this.userInfo.username
                    });
                }
            },

            onSubmitError: function( error ) {
                alert( error );
            },

            placeAt: function(container) {
                DomConstruct.place(this.main, container);

            },

            showResponseElements: function() {
                this.responseDiv.style.display="";
                this.buttonSubmit._setDisabledAttr(false);
            },

            hideResponseElements: function() {
                this.responseDiv.style.display="none";
                this.buttonSubmit._setDisabledAttr(false);
            }


        });
    }
);
