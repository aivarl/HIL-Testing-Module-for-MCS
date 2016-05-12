define([
    "dojo/_base/declare",
    "config/config",
    "dojo/dom-construct",
    "dijit/form/SimpleTextarea",
    "dijit/form/Button",
    "dijit/form/Form",
    "dojox/layout/TableContainer",
    "dijit/form/ValidationTextBox",
    "dojo/on",
    "dojo/_base/lang",
    "dojo/request",
    'common/store/BeaconStore',
    'dojo/date/locale',
    "common/store/GetUserInformation"
	],

	function( declare, Config, DomConstruct, SimpleTextarea, Button, Form, TableContainer, ValidationTextBox, 
	          On, Lang, Request, BeaconStore, Locale, GetUserInformation ) {

		return declare([], {

			constructor: function(args) {
				var self = this;

				 GetUserInformation(Lang.hitch(this, function (userInfo) {
	                    this.userInfo = userInfo;
	                 }));
				 
				this.main = DomConstruct.create("div", { });
				this.formWrapperDiv = DomConstruct.create("div", {style:"margin:10px"},  this.main);

				this.instructionLabel = DomConstruct.create(
											"div",
											{	innerHTML: "Enter one beacon per row in the following format:" +
														"<br><font color=blue>beaconString;receivedBy;datetime</font>" +
														"<br>datetime must be in format <font color=blue>YYYY-MM-DD HH:MM:SS</font>" +
														"<br>Any whitespace around the values will be trimmed" +
														"<br><br>Example:<br>" +
														"ES5E/S T WMTC5ET ZFHB6E ATTT DNTTTT TTFSFS 5A5NTT TTTZ TZTT KN ; recievedBy ; 2013-05-01 01:01:01",
												style:"margin:0px 0px 10px 0px"
											},
											this.formWrapperDiv );

				// create form
				this.formdiv = DomConstruct.create("div", {},  this.formWrapperDiv);
				this.form = new Form({ encType: "multipart/form-data", action: "", method: "" }, this.formdiv);

				// create form elements
				this.beaconDataField = new SimpleTextarea({
										cols:"100",
										rows:"10",
										label:"inputField,.,",
										style:"resize:none",
										//value:"aaa;bbb;1111-22-33 44:55:66\nccc;ddd;7777-88-99 00:11:22",
										placeholder:"ES5E/S T WMMDB5C ZFHB6E TTTT DTTTTT TTENEN 5F5FTT AHTT TTTT KN;recievedBy;2013-05-23 01:56:20"
									});

				this.submitButton = new Button({
												label: "Send data",
												style: "margin:10px 0px"
										});
				On( this.submitButton, "click", function() {
					self.sendBeaconData();
				});

				// Add elemets to form
				this.form.domNode.appendChild(this.beaconDataField.domNode);
				this.form.domNode.appendChild(DomConstruct.create("br"));
				this.form.domNode.appendChild(this.submitButton.domNode);

				// messages
				this.lineCount = 0;		// used for progress monitoring
				this.responseCount = 0;	// used for progress monitoring
				this.okCount = -1;
				this.okCountDiv = DomConstruct.create( "div", {style:"margin:10px"}, this.main );
				this.increaseOkCount();
				this.errorDiv = DomConstruct.create( "div", {style:"margin:10px; width:720px", innerHTML:"Errors:"}, this.main );
				//this.testMsg = DomConstruct.create( "div", {style:"color:lightblue", innerHTML:"---testMsg---"}, this.main );
			},



			// Validate basic formatting and send data to MCS
			sendBeaconData: function() {

				// disable send button and indicate processing
				this.submitButton._setDisabledAttr(true);
				this.submitButton.set( 'label', "Processing..." );

				var rows = this.beaconDataField.get('value').split('\n');
				var errorRows = new Array();			// contains the numbers of the rows that are erroneous
				this.errorDiv.innerHTML = "Errors:";	// erase old errors from display
				this.okCount = -1;
				this.increaseOkCount();
				this.lineCount = rows.length;
				this.responseCount = 0;

				for (var i = 0; i < rows.length; i++) {
					rows[i] = rows[i].split(';');		// split the line string into components

					// skip empty rows and increase responseCount
					if (rows[i].length == 1 && rows[i][0].length == 0 ) {
						this.responseCount++;
					}

					// check for invalid number of elements on line
					else if (rows[i].length != 3) {
						errorRows.push( [i, "Incorrect line format"] );
						this.errorDiv.innerHTML = this.errorDiv.innerHTML + "<br>Line " + (parseInt(i)+1) + ": Incorrect line format";
						this.responseCount++;
					}

					// line format is ok
					else {

						// trim whitespace
						for( var j = 0; j < 3; j++ ) {
							rows[i][j] = rows[i][j].match( /\S.*\S/ )[0];	// trim around each component

							var k;
							while( (k = rows[i][j].indexOf("  ")) >= 0 ) {
								rows[i][j] = rows[i][j].substring(0,k) + rows[i][j].substring(k+1);		// trim double spaces inside a component
						 	}
						}


						// check for correct date format
						// date-time is temporarily padded with 'x' on each side for easier regexp matching
						rows[i][2] = "x" + rows[i][2] + "x";
						var dateMatch = rows[i][2].match( /x\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\dx/ );
						rows[i][2] = rows[i][2].substr( 1, rows[i][2].length-2 );

						// incorrect date format
						if (dateMatch == null) {
							errorRows.push( [i, "Date Error"] );
							this.errorDiv.innerHTML = this.errorDiv.innerHTML + "<br>Line " + (parseInt(i)+1) + ": Invalid date";
							this.responseCount++;
						}

						// correct date format
						else {
						    Lang.hitch(this, function() {
    						    var beacon = {
    						        source: rows[i][1],
    						        datetime: rows[i][2],
    						        data: rows[i][0],
    						        insertedBy: this.userInfo.username,
    						        lineNumber: i
    						    };
    						    
    							// send POST
    							setTimeout( function(){}, 1000 ); // for processing indication
    							Request.post(Config.AddBeacons.SUBMIT_URL, {
    	    	                    data: beacon,
                        	    	handleAs: "json"
    		                    }).then(
    		                        Lang.hitch(this, function(response) {
    		                            this.postOK(response, beacon);
    		                        }),
            	        	        Lang.hitch(this, this.postFAIL)
                		        );
						    })();
						}
					}
				}

				if( this.responseCount >= this.lineCount ) {
					this.submitButton.set('label', 'Send data');
					this.submitButton.set('disabled', false);
				}

			},

			// Callback when request.post succeeds (doesn't indicate if data is ok or not)
			postOK: function( response, beacon ) {
				if( response.status == "ok" ) {
					this.increaseOkCount();
					
					var transformedBeacon = {
					    timestamp: Locale.parse(beacon.datetime, {
					        selector: "date",
					        datePattern: Config.DEFAULT_DATE_FORMAT_NO_MS
					    }).getTime(),
					    issuedBy: beacon.source,
                        value: beacon.data.replace(/ /g, ''),
                        insertedBy: this.userInfo.username
					}
					
					BeaconStore.put(transformedBeacon);
				}
				else if( response.status == "error" ) {
					this.errorDiv.innerHTML = this.errorDiv.innerHTML + "<br>Line " + (parseInt(response.lineNumber)+1) + ": " + response.exceptionMessage;
				}
				else
					alert( "Error:\n\n" + response + "\n\n" + "Line " + (parseInt(response.lineNumber)+1) + "\n\n" + response.message );

				this.responseCount++;
			//	alert( "lines: " + this.lineCount + "\nresponses: " + this.responseCount );
				if( this.responseCount >= this.lineCount ) {
					this.submitButton.set('label', 'Send data');
					this.submitButton._setDisabledAttr(false);
				}
			},

			// Callback when request.post fails
            postFAIL: function( error ) {
            	alert( "dojo.request.post() fail\nTry reloading the page\n\n" + error );
            },


			increaseOkCount: function() {
				this.okCount++;
				this.okCountDiv.innerHTML = "" + this.okCount + " lines sent";
			},


			placeAt: function(container) {
				DomConstruct.place( this.main, container );
			}

		});

    }
);
