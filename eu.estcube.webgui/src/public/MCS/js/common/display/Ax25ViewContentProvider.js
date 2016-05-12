define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/request",
    "dojox/layout/TableContainer",
    "dijit/form/Form",
    "dijit/form/SimpleTextarea",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dijit/form/NumberSpinner",
    "dijit/form/ValidationTextBox",
    "dijit/Dialog",
    "dijit/ProgressBar",
    "config/config",
    "./ContentProvider", 
    ],

    function(declare, Lang, Array, DomConstruct, on, request, TableContainer,
             Form, SimpleTextarea, ContentPane, Button, NumberSpinner, ValidationTextBox, 
             Dialog, ProgressBar, config, ContentProvider) {

        function Bytestring(min, max) {
            return "([0-9a-fA-F]{2}(\\s)*){" + min + "," + max + "}";
        }

        var ax25conf = config.COMMANDING;

        return declare(ContentProvider, {
            getContent: function (args) {
                this.mainContainer = DomConstruct.create("div", {
                    "class": "ax25-container",
                    "style": {
                        margin: "3px"
                    }
                });

                this.messageInfo = new ContentPane({
                    innerHTML: "",
                    style: "position:relative;left:-1.3%;top:-10.5px;width:100%; font-weight:bold"
                });

                var div = DomConstruct.create("div", {}, this.mainContainer);
                this.form = new Form({
                    encType: "multipart/form-data",
                    action: "",
                    method: "",
                    style: "width:80%"
                }, div);
                this.form.domNode.appendChild(this.messageInfo.domNode);

                table = new TableContainer({
                    cols: 2,
                    labelWidth: 75,
                    spacing: 0,
                    style: "position:relative;top:-8px;"
                });

                this.validatedFieldsData = [{
                    name: "destAddr",
                    label: "Destination address:"
                },
                {
                    name: "sourceAddr",
                    label: "Source address:"
                },
                {
                    name: "ctrl",
                    label: "CTRL:"
                },
                {
                    name: "pid",
                    label: "PID:"
                }];

                Array.forEach(this.validatedFieldsData, function (data) {

                    this.length = ax25conf.constraints[data.name].length;
                    this.value = ax25conf.defaults[data.name];
                    this.field = new ValidationTextBox({
                        name: data.name,
                        label: data.label,
                        pattern: Bytestring(this.length, this.length),
                        value: this.value,
                        required: true,
                        style: "width:80%;margin:3px"
                    });

                    table.addChild(this.field);
                });

                var portField = new NumberSpinner({
                    name: "port",
                    label: "TNC port:",
                    constraints: {
                        min: ax25conf.constraints.port.min,
                        max: ax25conf.constraints.port.max
                    },
                    value: ax25conf.defaults.port,
                    required: true,
                    style: "width:80%;margin:3px;"
                });

                this.infoField = new SimpleTextarea({
                    name: "info",
                    label: "Info:",
                    cols: 25,
                    rows: 4,
                    style: "height:50%;width:78%;margin:3px"
                });

                this.infoPattern = new RegExp("^" + Bytestring(ax25conf.constraints.info.minLength, ax25conf.constraints.info.maxLength) + "$");

                var buttonWrapper = new ContentPane({ style: "margin: -5px;" });

                var buttonSubmit = new Button({
                    label: "Send command",
                    title: "Submit frame",
                    style: "width:80%;position:relative;top:-4px"
                });

                buttonWrapper.addChild(buttonSubmit);

                on(buttonSubmit, "click", Lang.hitch(this, function () {
                    this.buttonClicked();
                }));

                table.addChild(this.infoField);
                table.addChild(portField);
                table.addChild(buttonWrapper);
                this.form.domNode.appendChild(table.domNode);
                return this.form;
            },

            buttonClicked:function(){        
                var self= this;
                if (!this.form.validate()) {
                     self.setMessage(true, "Invalid field values");
                } else if (!this.infoPattern.test(this.infoField.value)) {
                    var infoMin = ax25conf.constraints.info.minLength;
                    var infoMax = ax25conf.constraints.info.maxLength;
                    self.setMessage(true, "Invalid info size: must be " + infoMin + "-" + infoMax + "bytes");
                } else {                                                        
                    request.post(ax25conf.SUBMIT_URL, {
                        data: this.form.get('value'),
                        handleAs: 'json'
                    }).then(function(response) {                   
                        self.setMessage(true, "Sending...");
                        if( response.status == "OK") {
                            self.setMessage(false, "Command sent!");
                        } else {
                            self.setMessage(true, "Error: " + response.value);
                        }
                    }, function(error) {
                        self.setMessage(true, "Error: " +  error.response.status.toString());
                        
                        if (error.response.status == 403) {
                            self.setMessage(true, "You need to have premium operator rights to send commands");
                        } else {          
                            self.setMessage(true, "Error sending data to the server: " + error.response.text);
                        }
                    });
                }
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
                 }
             }
        })
    }
);