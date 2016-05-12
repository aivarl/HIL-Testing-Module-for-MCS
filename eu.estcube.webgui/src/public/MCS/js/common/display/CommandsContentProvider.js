define([
        "dojo/cookie",
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
        "dojo/on",
        "common/display/ObservableContentPane",
        "dgrid/Grid", 
        ], 
        
        function(Cookie, declare, DomConstruct, DomAttr, ContentPane, ContentProvider, declare, DomClass, DomConstruct,On, Lang, Request, Form, Button, ValidationTextBox, SimpleTextarea, ContentPane, TableContainer, Select, Grid, ItemFileReadStore, Json, Config, DateFormatter, Memory, FilteringSelect,  GetUserInformation, DoIntersect, Arrays,on,ObservableContentPane, Grid) {   
            return declare(ContentProvider, {
                getContent: function () {
                    this.main = DomConstruct.create("div", {
                        "class": "commanding-container",
                        "style": "width:1000px; margin:10px;"
                    });
                    this.messageInfo = new ContentPane({
                        innerHTML: "",
                        style: "position:relative;left:-1%;width:100%; font-weight:bold"
                    });

                    this.form = new Form({
                        encType: "multipart/form-data",
                        action: "",
                        method: "",
                        style: "width:91%",
                    }, this.div);
                    this.form.domNode.appendChild(this.messageInfo.domNode);


                    this.table = new TableContainer({
                        cols: this.cols || 1,
                        labelWidth: 100
                    });

                    this.source = new Select({
                        name: "source",
                        value: "",
                        placeHolder: "",
                        label: "Source:",
                        required: true,
                        style: "width:69.5%;margin:3px",
                        options: [{
                            label: "GS",
                            value: Config.COMMANDING.DEFAULT_GS
                        }, ],
                        value: "",
                        onChange: Lang.hitch(this, function () {
                            this.removeMessages();
                        })
                    });
                    this.table.addChild(this.source);
                    this.priority = new Select({
                        name: "priority",
                        value: "",
                        placeHolder: "",
                        label: "Priority:",
                        required: true,
                        style: "width:69.5%;margin:3px",
                        options: [{
                            label: "low priority",
                            value: 0
                        },
                        {
                            label: "high priority",
                            value: 1
                        },
                        {
                            label: " immediate",
                            value: 2
                        }, ],
                        onChange: Lang.hitch(this, function () {
                            this.removeMessages();
                        }),
                    });
                    this.table.addChild(this.priority);
                    this.CDHSBlockIndex = new ValidationTextBox({
                        name: "CDHSBlockIndex",
                        value: "",
                        placeHolder: "",
                        label: "CDHS block index:",
                        required: true,
                        disabled: true,
                        value: Config.COMMANDING.DEFAULT_CDHS_BLOCK_INDEX,
                        style: "width:69%;margin:3px",
                        onChange: Lang.hitch(this, function () {
                            this.removeMessages();
                        }),
                    });
                    this.CDHSSource = new ValidationTextBox({
                        name: "CDHSSource",
                        value: "",
                        placeHolder: "",
                        label: "CDHS source:",
                        disabled: true,
                        required: true,
                        value: Config.COMMANDING.DEFAULT_CDHS_SOURCE,
                        style: "width:69%;margin:3px",
                        onChange: Lang.hitch(this, function () {
                            this.removeMessages();
                        }),
                    });
                    this.destination = new Select({
                        name: "destination",
                        value: "",
                        placeHolder: "",
                        label: "Destination:",
                        required: true,
                        style: "width:69.5%;margin:3px",
                        options: [{
                            label: "CDHS",
                            value: 2,
                            selected: true
                        },
                        {
                            label: "EPS",
                            value: "0"
                        },
                        {
                            label: "COM",
                            value: 1
                        },
                        {
                            label: "CAM",
                            value: 5
                        }, ],
                        onChange: Lang.hitch(this, function (e) {
                            this.id.query = {
                                "subsystem": this.destination.get("value")
                            };
                            this.id.set("value", "");
                            this.clearArguments();
                            this.loadCommandArguments();
                            this.removeMessages();
                        })
                    });
                    this.table.addChild(this.destination);

                    if (this.initCdhs == true) {
                        this.table.addChild(this.CDHSSource);
                    }

                    var commandsStore = new ItemFileReadStore({
                        url: Config.COMMANDING.GET_COMMANDS_URL,
                        identifier: "id",
                    });
                    this.id = new FilteringSelect({
                        name: "id",
                        placeHolder: "ID or name",
                        label: "Command:",
                        required: true,
                        store: commandsStore,
                        searchAttr: "name",
                        style: "position:relative;width:69%;margin:3px",
                        query: {
                            subsystem: "-"
                        },
                        onChange: Lang.hitch(this, function () {
                            this.clearArguments();
                            this.loadCommandArguments();
                            this.removeMessages();
                        })
                    });
                    this.table.addChild(this.id);
                    if (this.initCdhs == true) {
                        this.table.addChild(this.CDHSBlockIndex);
                    }

                    this.arguments = new ValidationTextBox({
                        name: "arguments",
                        value: "",
                        placeHolder: "Separated by spaces",
                        label: "Arguments:",
                        style: "width:69%;margin:3px",
                        value: "",
                        onChange: Lang.hitch(this, function () {
                            this.removeMessages();
                        })
                    });
                    this.table.addChild(this.arguments);





                    this.ghost = new ValidationTextBox({
                        placeHolder: "",
                        style: "width:69%;margin:3px;visibility:hidden",
                        value: "",
                    });
                    this.table.addChild(this.ghost);




                    this.checkButton = new Button({
                        label: "Send command",
                        title: "",
                    });

                    On(this.checkButton, "click", Lang.hitch(this, function () {
                        this.submitCommand();
                    }));


                    this.argumentsInfo = new ContentPane({
                        id: this.descriptionId || "argumentsInfo",
                        name: "Description",
                        value: "",
                        placeHolder: "",
                        label: "Description:",
                        content: "",
                        style: "position:relative;width:100%;height:31%;margin:3px",
                        onChange: function () {
                            console.log("changed");
                        }
                    });

                    this.buttonWrapper = new ContentPane({
                        style: "margin: 0px; padding: 0px;"
                    });

                    this.buttonWrapper.addChild(this.checkButton);
                    this.table.addChild(this.buttonWrapper);

                    this.descriptionGrid = new Grid({
                        id: "description-grid",
                        columns: {
                            number: "Nr",
                            type: "Type",
                            name: "Name",
                            description: "Description",
                            unit: "Unit"
                        },
                    });




                    this.form.domNode.appendChild(this.table.domNode);
                    this.form.domNode.appendChild(this.argumentsInfo.domNode);
                    this.removeMessages();
                    this.id.query = {
                        "subsystem": this.destination.get("value")
                    };

                    this.formWidgets = [this.source, this.priority, this.destination, this.id, this.arguments, this.checkButton];


                    this.enableForm(DoIntersect(Config.ROLES_DEFAULT, config.ROLES_CAN_COMMAND));

                    GetUserInformation(Lang.hitch(this, function (userInfo) {
                        this.enableForm(DoIntersect(userInfo.roles, config.ROLES_CAN_COMMAND));
                    }));


                    return this.form;
                },
        
                enableForm: function (enable) {
                    Arrays.forEach(this.formWidgets, function (widget) {
                    widget.set("disabled", !enable);
                });
                },

                showCommandsDescription: function(command){
                    var info = "<b>Description: </b>" +command.description;
                    var argumentsDescription = [];
                    var parameters = command.parameters;

                    if(parameters.length == 0){
                        info = info + "<br>Command has no arguments!</br>";
                    }
                    else{

                        for(var i =0; i < parameters.length;i++) {
                            var oneArgumentDescription = {number: i+1, type: parameters[i].type, name:parameters[i].name, description:parameters[i].description ,unit:parameters[i].unit};
                            argumentsDescription.push(oneArgumentDescription);
                            console.log(oneArgumentDescription);
                        }

                        info = info + "<br>Command has " + parameters.length;

                        if(parameters.length==1){
                            info = info + " argument";
                        }
                        else{
                             info = info + " arguments";
                        }                    
                     }
                    var grid = document.getElementById("description-grid");
                    if(grid == null){
                        this.form.domNode.appendChild(this.descriptionGrid.domNode);
                    }
                    this.argumentsInfo.set("content",info);          
                    this.descriptionGrid.refresh();      
                    this.descriptionGrid.renderArray(argumentsDescription);
                },
        
                loadCommandArguments: function () {
                    var data = this.id.get('value').split("_");
                    if(data!=""){
                    Request.get(Config.COMMANDING.GET_COMMAND_ARGUMENTS_URL, {
                        query: {
                            command: data[0],    
                            subsys: data[1],
                        },
                        handleAs: "json",
                    }).then(        
                        Lang.hitch(this,function (response) {
                            if (response.status != "error") {                            
                                this.showCommandsDescription(response);
                                if(this.initCommandingPageLogics==true){
                                	var commandsPane = document.getElementById("commandsPane");
                                	commandsPane.style.height="0px";
                                    commandingBcHeight=  commandsPane.scrollHeight;
                                    commandsPane.style.height=commandingBcHeight + "px";
                                    

                                    var ax25ViewPane = document.getElementById("ax25ViewPane");
                                    ax25ViewPane.style.height="0px";
                                    var axBcHeight=  ax25ViewPane.scrollHeight;
                                    ax25ViewPane.style.height=axBcHeight+"px";    

                                    var mainContainer = document.getElementById("mainContainer");                                  
                                    mainContainer.style.height=commandingBcHeight +30 +"px";  
                                    
                                    var parametersView = document.getElementById("parametersView");    
                                    parHeight = parametersView.scrollHeight;
                                    parametersView.style.height = parHeight - 110 +"px";
                       
                                }                                
                                if (response.defaultValue != undefined) {
                                    this.arguments.set("value", response.defaultValue);       
                                }                                                             
                            } else {
                                console.log("Command not found!");
                                this.argumentsInfo.domNode.innerHTML = "Command not found!";
                            }                            
                        }), function (error) {
                                this.setMessage(true,  error);
                        });
                    }                   
                },
                clearArguments: function () {
                    this.arguments.reset();
                },
                submitCommand: function () {                  
                    if (this.form.validate()) {
                        this.setMessage(true,  "Sending...");
                        var data = this.id.get('value').split("_");
                        Request.post(Config.COMMANDING.SEND_COMMAND_URL, {
                            data: {
                                source: this.source.get('value'),
                                destination: data[1],
                                priority: this.priority.get('value'),
                                id: data[0],
                                CDHSSource: this.CDHSSource.get('value'),
                                CDHSBlockIndex: this.CDHSBlockIndex.get('value'),
                                arguments: this.arguments.get('value'),
                                satelliteId: "/ESTCUBE/Satellites/ESTCube-1",
                                groundStationId: Cookie("gsSelector")
                            },
                            handleAs: "json",
                        }

                        ).then(
                        Lang.hitch(this, function (response) {

                            this.setMessage(response.status != "ok", response.message);
                            console.log(response.message);
                        }), function (error) {
                            if (error.response.status == 403) {
                                this.setMessage(true,  "You need to have premium operator rights to send commands");
                            } else {
                                this.setMessage(true,  error);
                            }
                        });
                    } else {
                        this.setMessage(true,  "Please insert correct values!");
                    }},
                    
                placeAt: function (container) {
                    DomConstruct.place(this.main, container);
                },
                removeMessages: function () {
                    this.messageInfo.style.display = "none";
                    this.messageInfo.innerHTML = "";
                    
                },
                setMessage: function (isError, message) {
                    this.removeMessages();
                    if (isError) {
                        this.messageInfo.domNode.style.color = "red";
                        this.messageInfo.domNode.innerHTML = message;
                        this.messageInfo.style.display = "";
                    } else {
                        this.messageInfo.domNode.style.color = "green";
                        this.messageInfo.domNode.innerHTML = message;
                        this.messageInfo.style.display = "";
                    }}
    });
});