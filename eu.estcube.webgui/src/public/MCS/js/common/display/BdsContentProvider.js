define([
        "dojo/_base/declare", 
        "dojo/dom-construct", 
        "dojo/dom-attr", 
        "dijit/layout/ContentPane", 
        "./ContentProvider", 
        "dojo/_base/declare", 
        "dojo/dom-class", 
        "dojo/dom-construct", 
        "dojo/on", 
        "dojo/_base/lang", 
        "dojo/request", 
        "dijit/form/Form", 
        "dijit/form/Button", 
        "dijit/form/ValidationTextBox", 
        "dijit/form/SimpleTextarea", 
        "dijit/layout/ContentPane", 
        "dojox/layout/TableContainer", 
        "dijit/form/Select", 
        "dgrid/OnDemandGrid", 
        "dojo/data/ItemFileReadStore", // REMOVE!
        "dojo/json", 
        "config/config", 
        "common/formatter/DateFormatterS", 
        "dojo/store/Memory", 
        "dijit/form/FilteringSelect",
        "common/store/GetUserInformation",
        "common/utils/DoIntersect",
        "dojo/_base/array",
        "common/store/ParameterStore", 
        "common/store/DataHandler", 
        
        ], 
        
        function(declare, DomConstruct, DomAttr, ContentPane, ContentProvider, declare, DomClass, DomConstruct,On, Lang, Request, Form, Button, ValidationTextBox, SimpleTextarea, ContentPane, TableContainer,Select, Grid, ItemFileReadStore, Json, Config, DateFormatter, Memory, FilteringSelect, GetUserInformation, DoIntersect, Arrays,ParameterStore,DataHandler) {   
            return declare(ContentProvider, {             
                getContent: function () {
                    this.form = new Form({
                        encType: "multipart/form-data",
                        action: "",
                        method: ""
                    }, this.div);

                    this.bdstime = new Button({
                        label: "bdstime",
                    });

                    this.counterInfo = new ContentPane({
                        content: "Current counter value:"
                    });

                    GetUserInformation(Lang.hitch(this, function (userInfo) {
                        this.enableForm(DoIntersect(userInfo.roles, config.ROLES_CAN_COMMAND));
                    }));

                    var currentCounterValue;
                    var previousCounterValue;
                    
                    On(this.bdstime, "click", Lang.hitch(this, function() {
                    	this.submitCommand(["06", "0", "0", "10",""]);
                    	
                    	setTimeout(Lang.hitch(this, function() {
                    		this.submitCommand(["06", "0", "0", "9","2 1"])                        	
                        }), 1000);
                    	
                    	setTimeout(Lang.hitch(this, function() {
                    		this.submitCommand(["06", "0", "0", "10",""])                       	
                        }), 1500);
                    	
                    }));
                     
                    var pane = new ContentPane();
                    this.form.domNode.appendChild(this.bdstime.domNode);
                    pane.addChild(this.counterInfo);
                    pane.addChild(this.form);
                    
                    this.getCounterValue();
                    return pane;
                },
                submitCommand: function (command) {
                    var time = new Date().getTime();
                    if (this.form.validate()) {
                        Request.post(Config.COMMANDING.SEND_COMMAND_URL, {
                            data: {
                                source: command[0],
                                destination: command[1],
                                priority: command[2],
                                id: command[3],
                                CDHSSource: Config.COMMANDING.DEFAULT_CDHS_SOURCE,
                                CDHSBlockIndex: Config.COMMANDING.DEFAULT_CDHS_BLOCK_INDEX,
                                arguments: command[4]
                            },
                            handleAs: "json",
                        }).then(

                        function (response) {
                            this.setMessage(response.status != "ok", response.message);
                        }, function (error) {
                            if (error.response.status == 403) {
                                alert("You need to have premium operator rights to send commands");
                            } else {
                                alert(error);
                            }
                        });

                    } else {
                        alert("Please insert correct values!");
                    }
                },
                
                getCounterValue: function () {
                    var channelString = Config.WEBSOCKET_PARAMETERS;
                    var handler = new DataHandler({
                        channels: [channelString],
                        callback: Lang.hitch(this,function (message) {
                            if ((message.name == "counter")) {
                                if (this.currentCounterValue != message.value) {
                                    this.previousCounterVale = this.currentCounterValue;
                                }
                                this.currentCounterValue = message.value;
                                this.counterInfo.set('content', "Current counter value: " + this.currentCounterValue + "</br> Previous counter value: " + this.previousCounterVale);
                            }
                        })
                    });

                },
                enableForm: function (enable) {
                    this.bdstime.set("disabled", !enable);
                },
    });
});