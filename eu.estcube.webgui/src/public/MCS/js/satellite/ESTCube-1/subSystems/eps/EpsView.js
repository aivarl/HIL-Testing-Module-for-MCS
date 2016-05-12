define([
        "dojo/_base/declare", 
        "dojo/dom-class", 
        "dojo/dom-construct",
        "config/config",
        "dijit/layout/BorderContainer",
        "common/store/ParameterStore",
        "dojox/gfx",
        "dojox/gfx/fx",
        "common/formatter/DateFormatter", 
        "dijit/Tooltip",
        "dijit/layout/ContentPane",
        "dojo/_base/lang", 
        
        ], 
        function(declare, DomClass, DomConstruct, Config,BorderContainer,ParameterStore,gfx,fx,DateFormatter,Tooltip,ContentPane, Lang) {
            return declare([], {
                constructor: function (args) {
                    this.mainContainer = DomConstruct.create('div');
                    self = this;
                    this.surfaceWidth=0;
                    this.surfaceHeight=0;

                    this.layout = new BorderContainer({
                        style: {
                            width: '100%',
                            height: '100%',
                            margin: '0px',
                            padding: '2px'
                        }
                    }, this.mainContainer);
                    
                    
                    var leftPane = new ContentPane({ 
                        region: "center", 
                        style: {
                            width: "100%",
                            margin: "0px",
                            padding: "0px"
                        }
                    });
                    
                    this.layout.addChild(leftPane);
                    
                    
                    
                    this.width = Math.floor(container.offsetWidth );
                    this.height = Math.floor(container.offsetHeight );
                    this.fontSize = this.width/95;
                    this.fontSizeGroud = this.width/80;
                    this.shapeLineWidth = this.width/900;
                    
                    this.surface = dojox.gfx.createSurface(leftPane.domNode, this.width/8, this.height *0.98);
                    
                    this.drawDescriptionContent();
                    if(this.width< 1024 || this.height <500){
                        this.width= 1024;
                        this.height=657;
                    }
                                       
                         
                    dojox.gfx.registry = {};
                    regRegistry= {};
                    valueRegistry = [];
                    

                    this.drawMultiBox(["timestamp", "getversion", "counter"], ["Last update", "Firmware", "Reset counter"], this.width/4.87, this.height/11, this.width/80, this.height/60);
                    
                    this.normalBoxWidth= this.width*0.07;
                    this.normalBoxHeight= this.width*0.035;
                    
                    this.drawBoxes(["SPB"], [["spb_out"]],undefined, 0, this.width/4.5, this.height/15, true,["Secondary Power Bus, supplies EPS microcontroller and peripherals with power"]);                    
                    this.drawBoxes(["MPB"], [["mpb_ext1280","mpb_avr", "mpb_ext"]],undefined, 0, this.width/4.5, this.height/2.5, true,
                            [" Main Power Bus voltage, the central unregulated power bus on the satellite, voltage level shows EPS health, anything below 3.8 V shows abnormal behavior, below 3.6 V a serious fault, below 3.4 V critical state"]);
                    this.drawBoxes(["SPB_1", "SPB_2"],undefined,[["spba"],["spbb"]] , 10, this.width/5.5, this.height/5, false,
                            ["Secondary Power Bus regulator n, converts Main Power Bus voltage to Secondary Power bus level"]);
                    this.drawBoxes(["MPPT1", "MPPT2", "MPPT3"], undefined,undefined, 20, this.width/45, this.height/3.12, true,
                            ["Maximum Power Point Tracking module n, harvests energy from solar panels, outputs it to Main Power Bus"]);

                    this.drawGroupIndicator("Solar panel drivers", "red", this.width/60, this.height/3.2);

                    this.drawBoxes(["Battery_A", "Battery_B"], [ ["bat_a", "bat_temp_a"],["bat_b", "bat_temp_b"]], undefined,10, this.width/5.5, this.height/1.5, false,
                            [" Lithium-ion cell A/B, one of the redundant energy storage modules. Should be kept over 3.8 V"]);
                    this.drawBoxes(["CoilDriver_3", "CoilDriver_2", "CoilDriver_1"], undefined,undefined,10, this.width/2.0, this.height/18, true,
                            [" Coil Dirver n, controls the operation of one magnetic torquer (axis designation TBD)"]);

                    this.drawGroupIndicator("ADCS coil drivers", "blue",this.width/2.06, this.height/20);

                    this.drawBoxes(["5V_1", "5V_2"], undefined, [["reg5va"],["reg5vb"]],10,this.width/2.0, this.height/3.0, true,
                            ["5 V regulator n, converts Main Power Bus voltage to 5 V to be distributed to consumers, two of these are connected in parallel for redundancy"]);
                    this.drawBoxes(["3.3V_1", "3.3V_2"], undefined, [["reg3v3a"],["reg3v3b"]],10, this.width/2.0, this.height/1.93, true,
                            ["3.3 V regulator n, converts Main Power Bus voltage to 3.3 V to be distributed to consumers, two of these are connected in parallel for redundancy."]);
                    this.drawBoxes([ "12V_1", "12V_2"], undefined, [["reg12va"],["reg12vb"]],10,  this.width/2.0, this.height/1.42,true,
                            ["12 V regulator n, converts Main Power Bus voltage to 12 V +/- 5% to power the Payload, two of these are connected in parallel for redundancy"]);

                    this.drawGroupIndicator("Voltage converters", "#FF7700",this.width/2.06, this.height/1.10);

                    this.drawBoxes(["COM_5V", "ADCS_5V", "PL_5V", "COM_3.3V", "CAM_3.3V", "CDHS_3.3V_1", "CDHS_3.3V_2", "CDHS_3.3V_C", "PL_3.3V", "PL_12V"], 
                            [["ctl_com_5v"],  ["ctl_adcs_5v"], ["ctl_pl_5v"],  ["ctl_com_3v3"], ["ctl_cam_3v3"],["ctl_cdhs_a_3v3"], ["ctl_cdhs_b_3v3"],["ctl_cdhs_bsw_3v3"], ["ctl_pl_3v3"], ["ctl_pl_12v"]],
                   [["com5v"],  ["adcs5v"], ["payload5v"],  ["com3v3"], ["cam3v3"],["cdhs3v3a"], ["cdhs3v3b"],["cdhs3v3bsw"], ["payload3v3"], ["not_defined"]],                 
                    6, this.width/1.16, this.height/20, true,
                    ["5 V voltage line to COM subsystem, powers radio transmission and reception, including beacon","5 V voltage line to ADCS subsystem, powers ADCS sensors","5 V voltage line to Payload"
                     ,"3.3 V voltage line to COM subsystem","3.3 V voltage line that powers CAM subsystem","3.3 V voltage line that powers CHDS processor A","3.3 V voltage line that powers CHDS processor B",
                     "3.3 V voltage that powers components shared by both CDHS processors, including bus switch","3.3 V voltage line that powers Payload 3.3 V components","2 V +/- 5% voltage line that powers Payload 12 V components (motor and HV supply)"]);

                    this.drawGroupIndicator("Subsystem control circuits", "green", this.width/1.22, this.height/23);
                    this.drawArrow("MPPT1", ["MPB"], "test", "right", "black",[["mppt_a_cs"], "first"]);                     
                    this.drawArrow("MPPT2", ["MPB"], "test", "right", "black",[["mppt_b_cs"], "first"]);    
                    this.drawArrow("MPPT3", ["MPB"], "test", "right", "black",[["mppt_c_cs"], "first"]); 
                    this.drawArrow("MPB", ["SPB_1", "SPB_2"], "test", "up", "black",[["spb_a_cs","spb_b_cs"], "third"]); 
                    this.drawArrow("MPB", ["CoilDriver_3", "CoilDriver_2", "CoilDriver_1", "5V_1", "5V_2", "3.3V_1", "3.3V_2", "12V_1", "12V_2"], "test", "right", "black",[["coil_c_cs","coil_b_cs","coil_a_cs","reg5v_a_cs","reg5v_b_cs","reg3v3_a_cs","reg3v3_b_cs","reg12v_a_cs","reg12v_b_cs"], "third"]); 
                    this.drawArrow("Battery_A", ["MPB"], "test", "up", "black",[["bp_a_tb_cs","bt_a_fb_cs"], "first"]);                    
                    this.drawArrow("Battery_B", ["MPB"], "test", "up", "black",[["bp_b_tb_cs","bt_b_fb_cs"], "first"]);                     
                    this.drawArrow("SPB_1", ["SPB"], "test", "up", "black",[[null], "first"]); 
                    this.drawArrow("SPB_2", ["SPB"], "test", "up", "black",[[null], "first"]); 
                    
                    this.drawArrowJoint("5V_1","5V_2","reg5v_out",0 - this.width/45);
                    this.drawArrow("from_5V_1_to_5V_2", ["COM_5V", "ADCS_5V", "PL_5V"], "test", "right", "black",[["ctl_com_5v_cs", "ctl_adcs_cs", "ctl_pl_5v_cs"], "third"]); 
                    
                    this.drawArrowJoint("3.3V_1","3.3V_2","reg_3v3_out",10);
                    
                    this.drawArrow("from_3.3V_1_to_3.3V_2", ["COM_3.3V", "CAM_3.3V", "CDHS_3.3V_1", "CDHS_3.3V_2", "CDHS_3.3V_C", "PL_3.3V"], "test", "right", "black",[["ctl_com_cs","ctl_cam_3v3_cs","ctl_cdhs_a_cs","ctl_cdhs_b_cs","ctl_cdhs_bsw_cs","ctl_pl_3v3_cs"], "third"]); 
                    
                    this.drawArrowJoint("12V_1","12V_2","reg12v_out",0);                    
                    this.drawArrow("from_12V_1_to_12V_2", ["PL_12V"], "test", "right", "black",[[null], "first"]); 
                               
                    dojox.gfx.registry["bpbfa_ind"] = -1;
                    dojox.gfx.registry["bpbta_ind"] = -1;
                    dojox.gfx.registry["bpbfb_ind"] = -1;
                    dojox.gfx.registry["bpbtb_ind"] = -1;
                    this.allBatteryValuesReceived = 0;

                    this.drawArrowIndicators(this.width * 0.285, this.height * 0.604, 30, "bat_b");
                    this.drawArrowIndicators(this.width * 0.205, this.height * 0.603, 30, "bat_a");
                                    
                    var epsVisualisationDataFilter = ParameterStore.query({
                        ID: /\/.*\/Satellites\/.*\/EPS/
                    });

                    epsVisualisationDataFilter.forEach(Lang.hitch(this,function(object) {
                        this.displayingData(object);
                        })
                    );

                    var epsVisualisationDataObserve = epsVisualisationDataFilter.observe(Lang.hitch(this, function (object) {
                        this.displayingData(object);
                        }), true);      


              },

                placeAt: function (container) {
                    DomConstruct.place(this.mainContainer, container);
                    this.layout.startup();
                    this.surface.rawNode.attributes.width.value=this.surfaceWidth;   

                },

                displayingData: function(object){

                    var timestamp = new Date().getTime();
                        var csValue = object.name + "_cs";
                        var regValue = object.name + "_reg";
                        var valueId = object.name + "_value";
                        
                        self.changeBoxValue("timestamp", DateFormatter(timestamp));
                        
                        if (object.name + "_ind" in dojox.gfx.registry) {
                            dojox.gfx.registry[object.name + "_ind"] = object.value;
                            self.allBatteryValuesReceived = self.allBatteryValuesReceived + 1;

                            if (self.allBatteryValuesReceived == 4) {
                                console.log("[EPS view] All battery indicators received");
                                self.changeBatteryIndicatorStatus();
                            }

                        }
                                                                        
                        if (object.class == "Parameter") {
                            if (csValue in dojox.gfx.registry) {
                                var csBoolean = dojox.gfx.registry[csValue];
                                if (parseInt(object.value) == 0) {
                                    self.changeBoxValue(object.name, object.value, object);
                                }
                                else {
                                    self.changeBoxValue(object.name, object.value, object);
                                }
                            }
                            else if (regValue in regRegistry && object.name.indexOf("_cs") == -1) {
                                var regBoolean = regRegistry[regValue];
                                var parentBoxId = regBoolean.rawNode.parentRegId;                               
                                if (parseInt(object.value) == 0) {
                                    self.changeBoxColor(parentBoxId, "#808080");
                                }
                                else {
                                    self.changeBoxColor(parentBoxId, "#89FF00");
                                }
                            }
                            else {
                                if (valueId in dojox.gfx.registry) {
                                    var value = dojox.gfx.registry[valueId];
                                    var parentBoxId = value.rawNode.parentBox;
                                    self.changeBoxValue(object.name, object.value, object);
                                }
                            }
                        }

                },
                
                createToolTips:function(boxId, tipContent){
                    
                    var shape =  dojox.gfx.registry[boxId];
                    
                    var tooltipContent = DomConstruct.create('div', {
                        class: 'contactTooltip'
                    });
                    
                    DomConstruct.create("div", {
                        class: boxId,
                        id:"tooltip",
                        innerHTML: boxId+" : "+tipContent
                    }, tooltipContent);
                    var x;
                    var y;
                    
                    if (boxId.indexOf("_box")!=-1) {
                        var rbox = shape.getTransformedBoundingBox();
                        x = rbox[1].x;
                        y = rbox[1].y;
                    }
                    else{
                        x = shape.rawNode.attributes.x.value + 70;
                        y = shape.rawNode.attributes.y.value ;
                    }
                   
                    
                    var contactTooltip = {
                            content: tooltipContent.outerHTML,
                            around: {
                                x: x,
                                y: y ,
                                w: 1,
                                h: 1
                            },
                            position: ["after-centered"]
                        }
                                
                    shape.connect("mousemove", function(e) {
                        contactTooltip.around.y = e.pageY;
                        Tooltip.show(contactTooltip.content, contactTooltip.around, contactTooltip.position);
                        var mouseOutHandler = shape.connect("mouseout", function() {
                            Tooltip.hide(contactTooltip.around);
                            dojo.disconnect(mouseOutHandler);
                        });
                     });

          
                },

                
                drawGroupIndicator: function (label, color, labelX, labelY, x, y, width, height) {
                    var shapeValue = this.surface.createText({
                        x: labelX,
                        y: labelY,
                        text: label,
                    }).setFont({
                        weight: "bold",
                        size: this.fontSizeGroud,
                        family:"Arial"
                    }).setFill("black");
 
                },

                drawArrow: function (from, to, label, type, color, arrowLabel) {
                    var fromBox = dojox.gfx.registry[from + "_box"].rawNode;
                    for (var i = 0; i < to.length; i++) {
                        var toBox = dojox.gfx.registry[to[i] + "_box"].rawNode;
                        var arrowXstart = 0;
                        var arrowYstart = 0;
                        var arrowXend = 0;
                        var arrowYend = 0;
                        var firstArrowElement;
                        var secondArrowElement;
                        var thirdArrowElement;
                        if (fromBox.attributes.width == undefined || fromBox.attributes.height == undefined) {
                            var width = 1;
                            var height = parseInt(fromBox.attributes.y2.value) - parseInt(fromBox.attributes.y1.value);
                            var x = fromBox.attributes.x2.value;
                            var y = parseInt(fromBox.attributes.y1.value) - this.width/48;


                        }
                        else {
                            var x = fromBox.attributes.x.value;
                            var y = fromBox.attributes.y.value;
                            var width = fromBox.attributes.width.value;
                            var height = fromBox.attributes.height.value;
                        }
                        var startBoxCoordinates = {
                            x: x,
                            y: y,
                            width: width,
                            height: height
                        };
                        var endBoxCoordinates = {
                            x: toBox.attributes.x.value,
                            y: toBox.attributes.y.value,
                            width: toBox.attributes.width.value,
                            height: toBox.attributes.height.value
                        };

                        if (type == "right") {
                            arrowXstart = parseInt(startBoxCoordinates.x) + parseInt(startBoxCoordinates.width);
                            arrowYstart = parseInt(startBoxCoordinates.y) + parseInt(startBoxCoordinates.height) / 2;
                            arrowXend = arrowXstart + (parseInt(endBoxCoordinates.x) - arrowXstart) / 2;
                            arrowYend = arrowYstart;
                        }
                        else if (type == "up") {
                            arrowXstart = parseInt(startBoxCoordinates.x) + parseInt(startBoxCoordinates.width) / 2;
                            arrowYstart = parseInt(startBoxCoordinates.y);
                            arrowXend = arrowXstart;
                            arrowYend = arrowYstart - Math.abs(parseInt(startBoxCoordinates.y) - (parseInt(endBoxCoordinates.y) + parseInt(endBoxCoordinates.height))) / 2;
                        }

                        firstArrowElement = this.surface.createLine({
                            x1: arrowXstart,
                            y1: arrowYstart,
                            x2: arrowXend,
                            y2: arrowYend
                        }).setStroke({
                            width: this.shapeLineWidth
                        });

                        firstArrowElement.rawNode.csId = arrowLabel[0][i];

                        dojox.gfx.registry["first" + "_from_" + from + "_to_" + to[i]] = firstArrowElement;

                        if (type == "right") {
                            arrowXstart = arrowXend;
                            arrowYstart = arrowYend;
                            arrowYend = parseInt(endBoxCoordinates.y) + parseInt(endBoxCoordinates.height) / 2;
                        }

                        else if (type == "up") {
                            arrowXstart = arrowXend;
                            arrowYstart = arrowYend;
                            arrowXend = parseInt(endBoxCoordinates.x) + parseInt(endBoxCoordinates.width) / 2
                            arrowYend = arrowYstart;

                        }

                        secondArrowElement = this.surface.createLine({
                            x1: arrowXstart,
                            y1: arrowYstart,
                            x2: arrowXend,
                            y2: arrowYend
                        }).setStroke({
                            width: this.shapeLineWidth
                        });

                        secondArrowElement.rawNode.csId = arrowLabel[0][i];
                        dojox.gfx.registry["second" + "_from_" + from + "_to_" + to[i]] = secondArrowElement;

                        if (type == "right") {
                            arrowXstart = arrowXend;
                            arrowYstart = arrowYend;
                            arrowXend = arrowXstart + (parseInt(endBoxCoordinates.x) - arrowXstart);
                            arrowYend = parseInt(endBoxCoordinates.y) + parseInt(endBoxCoordinates.height) / 2;
                        }
                        else if (type == "up") {
                            arrowXstart = arrowXend;
                            arrowYstart = arrowYend;
                            arrowXend = arrowXstart;
                            arrowYend = parseInt(endBoxCoordinates.y) + parseInt(endBoxCoordinates.height);
                        }

                        thirdArrowElement = this.surface.createLine({
                            x1: arrowXstart,
                            y1: arrowYstart,
                            x2: arrowXend,
                            y2: arrowYend
                        }).setStroke({
                            width: this.shapeLineWidth
                        });

                        thirdArrowElement.rawNode.csId = arrowLabel[0][i];
                        dojox.gfx.registry["third" + "_from_" + from + "_to_" + to[i]] = thirdArrowElement;

                        if (type == "right") {

                            this.surface.createLine({
                                x1: arrowXend,
                                y1: arrowYend,
                                x2: arrowXend - 8,
                                y2: arrowYend - 8
                            }).setStroke({
                                width: this.shapeLineWidth
                            });

                            this.surface.createLine({
                                x1: arrowXend,
                                y1: arrowYend,
                                x2: arrowXend - 8,
                                y2: arrowYend + 8
                            }).setStroke({
                                width:this.shapeLineWidth
                            });

                        }

                        else if (type == "up") {

                            this.surface.createLine({
                                x1: arrowXend,
                                y1: arrowYend,
                                x2: arrowXend - 8,
                                y2: arrowYend + 8
                            }).setStroke({
                                width: this.shapeLineWidth
                            });

                            this.surface.createLine({
                                x1: arrowXend,
                                y1: arrowYend,
                                x2: arrowXend + 8,
                                y2: arrowYend + 8
                            }).setStroke({
                                width: this.shapeLineWidth
                            });

                        }

                        var labelX = 0;
                        var labelY = 0;
                        var idConstantPart = arrowLabel[1] + "_from_" + from + "_to_" + to[i];

                        var ArrowElement = dojox.gfx.registry[idConstantPart];

                        labelX = parseInt(ArrowElement.rawNode.attributes.x1.value);
                        labelY = parseInt(ArrowElement.rawNode.attributes.y1.value);
                        if (type == "right") {
                            labelX = labelX + 10;
                            labelY = labelY - 5;

                        }
                        else if (type == "up") {
                            labelX = labelX + 10;
                            labelY = labelY - 10;
                        }
                        if (arrowLabel[0][i] != null) {
                            var arrowLabelValue = this.surface.createText({
                                x: labelX,
                                y: labelY,
                                text: arrowLabel[0][i] + ": "+config.VALUE_UNKNOWN,
                            }).setFont({
                                weight: "bold",
                                size: this.fontSize,
                                family:"Arial"
                            }).setFill("red");
                           
                            arrowLabelValue.rawNode.parrentArrowLabel = idConstantPart;
                            dojox.gfx.registry[arrowLabel[0][i] + "_value"] = arrowLabelValue;
                        }

                    }
                },

                drawBoxes: function (id, values, influenceBoolean, stepp, startX, startY, vertically, tooltips) {
                    
                    var width = this.normalBoxWidth;
                    var height = this.normalBoxHeight;
                    
                    if((startX+width)> this.surfaceWidth){
                        this.surfaceWidth=startX+width+ this.width/16;                       
                    }
                                                              
                    var startH = startY;
                    var startW = startX;
                    var labelH = startY;
                    var labelW = startW;                                   

                    var registryArr = {};
                    var regRegistryArr = {};
                    registryArr = dojox.gfx.registry;
                    regRegistryArr = regRegistry;

                    for (var i = 0; i < id.length; i++) {
                        
                        var tempHeight=height;
                        if(values!=undefined){                                 
                           if(values[0].length==2 ){
                               tempHeight=tempHeight+this.height/48;                             
                           }
                            if(values[0].length==3){
                                tempHeight=tempHeight+this.height/20;                               
                           }
                        }
                                               
                        var shape = this.surface.createRect({
                            label:id[i] + "_box",
                            x: startW,
                            y: startH,
                            width: width,
                            height: tempHeight
                        }).setStroke("#000000").setFill("transparent").setFill("inherit");
                        
                        shape.groupStepp = stepp;
                        registryArr[id[i] + "_box"] = shape;
                        
                        if (influenceBoolean != undefined) {
                            shape.rawNode.influenceBoolean = "";
                            for (var z = 0; z < influenceBoolean[i].length; z++) {
                                shape.rawNode.parentRegId = id[i] + "_box";
                                regRegistryArr[influenceBoolean[i][z] + "_reg"] = shape;
                            }
                        }
                        
                        labelH = labelH + this.height/40;                        
                       
                        if (values == undefined) {
                            labelH = labelH +  height/2 - this.height/80;
                        }
                                                                        
                        var shapeLabel = this.surface.createText({
                            x: labelW +  width/2,
                            y: labelH,
                            text:id[i],
                            align:"middle"
                        }).setFont({
                            size: this.fontSize,
                            weight: "bold",
                            family:"Arial"
                        }).setFill("black");
                                                                                                               
                        labelH = labelH + this.height/40;

                        if (values != undefined) {

                            for (var j = 0; j < values[i].length; j++) {
                                var shapeValue = this.surface.createText({
                                    x: labelW +  width/2,
                                    y: labelH,
                                    text: ": "+config.VALUE_UNKNOWN,
                                   align:"middle"
                                }).setFont({
                                    size: this.fontSize,
                                    weight: "bold",
                                    family:"Arial"
                                }).setFill("red");

                                shapeValue.rawNode.parentBox = id[i];
                                shapeValue.rawNode.parrentArrowLabel = id[i]+"_box";
                                shapeValue.rawNode.id = values[i][j] + "_value";
                                valueRegistry.push(shapeValue.rawNode.id);
                                

                                registryArr[values[i][j] + "_value"] = shapeValue;

                                labelH = labelH + this.height/40;

                                if(tooltips!=undefined){
                                    var tipValue;
                                    if(tooltips[i]!=undefined){
                                        tipValue=tooltips[i];                               
                                    }
                                    else{
                                        tipValue=tooltips[0];                                 
                                    }
                                   this.createToolTips(values[i][j] + "_value",tipValue);

                                 }

                            }
                        }

                        if (vertically == true) {
                            startH = startH + height + stepp;
                         
                            labelH = startH;
                        } else {
                            startW = startW + width + stepp;
                            labelH = startH;
                            labelW = startW;
                        }
                        
                        
                        registryArr[id[i] + "_label"] = shapeLabel;
                      
                        if(tooltips!=undefined){
                            var tipValue;
                            if(tooltips[i]!=undefined){
                                tipValue=tooltips[i];                               
                            }
                            else{
                                tipValue=tooltips[0];                                 
                            }
                           this.createToolTips(id[i]+"_box",tipValue);
                           this.createToolTips(id[i] + "_label",tipValue);

                        }

                    }

                    dojox.gfx.registry = registryArr;
                    regRegistry = regRegistryArr;
                }, 

                drawMultiBox: function (valueId, valueLabel, width, height, startX, startY) {
                    var registryArr = {};
                    registryArr = dojox.gfx.registry;
                    var startH = startY;
                    var startW = startX;

                    var shape = this.surface.createRect({
                        x: startX,
                        y: startY,
                        width: width,
                        height: height
                    }).setStroke("#000000").setFill("white");

                    for (var i = 0; i < valueId.length; i++) {

                        var shapeLabel = this.surface.createText({
                            x: startX + this.width/140,
                            y: startH + this.height/40,
                            text: valueLabel[i] + ": "+config.VALUE_UNKNOWN,
                        }).setFont({
                            size: this.fontSize,
                            weight: "bold",
                            family:"Arial"
                        }).setFill("red");
                        shapeLabel.multibox=true;
                       
                        
                        registryArr[valueId[i] + "_value"] = shapeLabel;
                        
                        startH = startH + this.height/40;
                    }
                },

                changeBoxColor: function (boxId, color) {
                    var shape = dojox.gfx.registry[boxId];
                    if (shape != undefined) {
                        shape.setFill(color);
                        this.eventAnimation(shape);
           
                    }

                },
                
                eventAnimation:function(shape){
                    dojox.gfx.fx.animateStroke({
                        shape: shape,
                        duration: 1000,
                        color: { start: "#FFD700", end: "black" },
                        width: { start:10 , end:this.shapeLineWidth},
                    }).play();
                    
                },
                
                
                drawArrowJoint: function (first, second, label, widthKoef) {
                    var fromBox = dojox.gfx.registry[first + "_box"].rawNode;
                    var toBox = dojox.gfx.registry[second + "_box"].rawNode;

                    var startBoxCoordinates = {
                        x: fromBox.attributes.x.value,
                        y: fromBox.attributes.y.value,
                        width: fromBox.attributes.width.value,
                        height: fromBox.attributes.height.value
                    };
                    var endBoxCoordinates = {
                        x: toBox.attributes.x.value,
                        y: toBox.attributes.y.value,
                        width: toBox.attributes.width.value,
                        height: toBox.attributes.height.value
                    };

                    var arrowXstartFirst = parseInt(startBoxCoordinates.x) + parseInt(startBoxCoordinates.width);
                    var arrowYstartFirst = parseInt(startBoxCoordinates.y) + parseInt(startBoxCoordinates.height) / 2;

                    var arrowXendFirst = arrowXstartFirst + this.width/22;
                    var arrowYendFirst = arrowYstartFirst;

                    firstArrowElement = this.surface.createLine({
                        x1: arrowXstartFirst,
                        y1: arrowYstartFirst,
                        x2: arrowXendFirst + parseInt(widthKoef),
                        y2: arrowYendFirst
                    }).setStroke({
                        width: this.shapeLineWidth
                    });

                    var arrowXstartEnd = parseInt(endBoxCoordinates.x) + parseInt(endBoxCoordinates.width);
                    var arrowYstartEnd = parseInt(endBoxCoordinates.y) + parseInt(endBoxCoordinates.height) / 2;

                    var arrowXendEnd = arrowXstartEnd + this.width/22;
                    var arrowYendEnd = arrowYstartEnd;

                    firstArrowElement = this.surface.createLine({
                        x1: arrowXstartEnd,
                        y1: arrowYstartEnd,
                        x2: arrowXendEnd + parseInt(widthKoef),
                        y2: arrowYstartEnd
                    }).setStroke({
                        width: this.shapeLineWidth
                    });

                    secondArrowElement = this.surface.createLine({
                        x1: arrowXendFirst + parseInt(widthKoef),
                        y1: arrowYendFirst,
                        x2: arrowXendFirst + parseInt(widthKoef),
                        y2: arrowYstartEnd
                    }).setStroke({
                        width: this.shapeLineWidth
                    });

                    dojox.gfx.registry["from_" + first + "_to_" + second + "_box"] = firstArrowElement;
                               
                    var arrowLabelValue = this.surface.createText({
                        x: arrowXendFirst  + this.width/80,
                        y: arrowYstartEnd - (arrowYstartEnd   - arrowYendFirst)/2 - this.width /110,
                        text: label + ": "+config.VALUE_UNKNOWN,
                    }).setFont({
                        weight: "bold",
                        size: this.fontSize,
                        family:"Arial"
                    }).setFill("red");
                    
                    arrowLabelValue.rawNode.readOnly = true;
                    dojox.gfx.registry[label+ "_value"] = arrowLabelValue;


                },
                
                drawArrowHead: function (startCoordinates, type) {
                    var startX = startCoordinates[0];
                    var startY = startCoordinates[1];

                    if (type == "up") {
                        headCoordinates = [
                            [startX - 8, startY + 5],
                            [startX + 8, startY + 5]
                        ];
                    }
                    else {
                        headCoordinates = [
                            [startX - 8, startY - 5],
                            [startX + 8, startY - 5]
                        ];
                    }

                    var downArrowUpLeftElement = this.surface.createPolyline([{
                        x: headCoordinates[0][0],
                        y: headCoordinates[0][1]
                    },
                    {
                        x: startX,
                        y: startY
                    },
                    {
                        x: headCoordinates[1][0],
                        y: headCoordinates[1][1]
                    }, ]).setStroke("black").
                    setStroke({
                        width: this.shapeLineWidth + 1
                    });

                    return downArrowUpLeftElement;
                },
                                                        
                drawArrowIndicators: function(x, y, height, label){
                    var upArrow = this.drawArrowHead([x,y], "up");                   
                    dojox.gfx.registry[label+"_upArrow"] = upArrow;                   
                    var mainLine = this.surface.createLine({
                        x1: x,
                        y1: y,
                        x2: x,
                        y2: y + height
                    }).setStroke("black").
                    setStroke({
                        width: this.shapeLineWidth+1
                    });                       
                    dojox.gfx.registry[label+"_arrowBody"] = mainLine;                    
                    var downArrow = this.drawArrowHead([x,y+height], "down");     
                    dojox.gfx.registry[label+"_downArrow"] = downArrow;       
                },
                
                changeBatteryIndicatorStatus: function () {
                    var batAarrow = {
                        upArrowHead: dojox.gfx.registry["bat_a_upArrow"],
                        downArrowHead: dojox.gfx.registry["bat_a_downArrow"],
                        arrowBody: dojox.gfx.registry["bat_a_arrowBody"],
                        from: dojox.gfx.registry["bpbfa_ind"],
                        to: dojox.gfx.registry["bpbta_ind"],
                    };
                    var batBarrow = {
                        upArrowHead: dojox.gfx.registry["bat_b_upArrow"],
                        downArrowHead: dojox.gfx.registry["bat_b_downArrow"],
                        arrowBody: dojox.gfx.registry["bat_b_arrowBody"],
                        from: dojox.gfx.registry["bpbfb_ind"],
                        to: dojox.gfx.registry["bpbtb_ind"],
                    };
                    var arrows = [batAarrow, batBarrow];
                    for (var i = 0; i < arrows.length; i++) {
                        if (arrows[i].from == "0" && arrows[i].to == "0") {
                            arrows[i].upArrowHead.setStroke({
                                width: this.shapeLineWidth,
                                color: "red"
                            });
                            arrows[i].downArrowHead.setStroke({
                                width: this.shapeLineWidth,
                                color: "red"
                            });
                            arrows[i].arrowBody.setStroke({
                                width: this.shapeLineWidth,
                                color: "red"
                            });;
                        }
                        else if (arrows[i].from == "1" && arrows[i].to == "1") {
                            arrows[i].upArrowHead.setStroke({
                                width: this.shapeLineWidth,
                                color: "green"
                            });
                            arrows[i].downArrowHead.setStroke({
                                width: this.shapeLineWidth,
                                color: "green"
                            });
                            arrows[i].arrowBody.setStroke({
                                width: this.shapeLineWidth,
                                color: "green"
                            });
                        }
                        else if ((arrows[i].from == "0" && arrows[i].to == "1") || (arrows[i].from == "1" && arrows[i].to == "0")) {
                            arrows[i].arrowBody.setStroke({
                                width: this.shapeLineWidth,
                                color: "#FFA500"
                            });
                            if (arrows[i].from == "1") {
                                arrows[i].downArrowHead.setStroke({
                                    width: this.shapeLineWidth,
                                    color: "white"
                                });
                                arrows[i].upArrowHead.setStroke({
                                    width: this.shapeLineWidth,
                                    color: "#FFA500"
                                });

                            }
                            else {
                                arrows[i].downArrowHead.setStroke({
                                    width: this.shapeLineWidth,
                                    color: "#FFA500"
                                });
                                arrows[i].upArrowHead.setStroke({
                                    width: this.shapeLineWidth,
                                    color: "white"
                                });
                            }
                        }
                    }
                },
                
                
                drawDescriptionContent:function(){
                    
                    this.surface.createRect({
                        x: this.width *0.01,
                        y: this.height*0.79,
                        width: this.width*0.27,
                        height: this.height*0.19,
                   }).setStroke("#000000").setFill("white");
                    
                    this.surface.createRect({
                        x: this.width *0.014,
                         y: this.height*0.80,
                        width: this.width*0.015,
                        height: this.height*0.02,
                   }).setStroke("#000000").setFill("#89FF00");
                    
                    this.surface.createText({
                        x:this.width *0.033,
                        y: this.height*0.816,
                        text: "- component is turned on ",
                    }).setFont({
                        size: this.fontSizeGroud,
                        family:"Arial"
                    }).setFill("black");
                    
                    this.surface.createRect({
                        x: this.width *0.014,
                         y: this.height*0.83,
                        width: this.width*0.015,
                        height: this.height*0.02,
                   }).setStroke("#000000").setFill("#808080");                                        
                    
                    this.surface.createText({
                        x:this.width *0.033,
                        y: this.height*0.849,
                        text: "- component is turned off ",
                    }).setFont({
                        size: this.fontSizeGroud,
                        family:"Arial"
                    }).setFill("black");                   
                    
                    this.surface.createRect({
                        x: this.width *0.014,
                         y: this.height*0.86,
                        width: this.width*0.015,
                        height: this.height*0.02,
                   }).setStroke("#000000").setFill("white");                                        
                    
                    this.surface.createText({
                        x:this.width *0.033,
                        y: this.height*0.877    ,
                        text: "- component status is unknown ",
                    }).setFont({
                        size: this.fontSizeGroud,
                        family:"Arial"
                    }).setFill("black");
                                                                                                                  
                    this.drawArrowHead([this.width *0.022,this.height*0.89], "up");       
                    this.surface.createLine({
                        x1: this.width *0.022,
                        y1: this.height*0.89,
                        x2: this.width *0.022,
                        y2: this.height*0.91
                    }).setStroke({
                        width: this.shapeLineWidth
                    });  
                    this.drawArrowHead([this.width *0.022,this.height*0.91], "down");  
                    
                    
                   this.surface.createText({
                        x:this.width *0.035,
                        y: this.height*0.91,
                        text: "green/ red - both directions active/innactive",
                    }).setFont({
                        size: this.fontSizeGroud,
                        family:"Arial"
                    }).setFill("black");
                    
                    
                    this.drawArrowHead([this.width *0.022,this.height*0.92], "up");       
                    this.surface.createLine({
                        x1: this.width *0.022,
                        y1: this.height*0.92,
                        x2: this.width *0.022,
                        y2: this.height*0.94
                    }).setStroke({
                        width: this.shapeLineWidth
                    });  
                      
                    this.surface.createLine({
                        x1: this.width *0.032,
                        y1: this.height*0.92,
                        x2: this.width *0.032,
                        y2: this.height*0.94
                    }).setStroke({
                        width: this.shapeLineWidth
                    });  
                    
                    this.drawArrowHead([this.width *0.032,this.height*0.94], "down");    
                        
                    
                    this.surface.createText({
                        x:this.width *0.043,
                        y: this.height*0.936,
                        text:  "green/ red - one direction active/innactive",
                    }).setFont({
                        size: this.fontSizeGroud,
                        family:"Arial"
                    }).setFill("black");
                    
                    this.surface.createText({
                    x:this.width *0.014,
                    y: this.height*0.965,
                    text: "Navigate mouse to the box to see the tooltip.",
                }).setFont({
                    size: this.fontSizeGroud,
                    family:"Arial"
                }).setFill("black");
                    
                    
                },
    

                changeBoxValue: function (valueId, value, object) {
                    
                    var shapeValue = dojox.gfx.registry[valueId + "_value"];
                    if(shapeValue.rawNode.parrentArrowLabel != undefined){
                        this.eventAnimation(dojox.gfx.registry[shapeValue.rawNode.parrentArrowLabel]);
                        
                    }
                    if (shapeValue != undefined) {
                        var valueConstantPart = shapeValue.rawNode.textContent.split(":")[0];
                        if (shapeValue.multibox==true) {
                            shapeValue.rawNode.textContent = valueConstantPart + " : " + value;
                        }
                        else {
                            if(object!=undefined){
                            var units;
                            if (object.name.indexOf("temp") != -1) {
                                units = "°C";
                            }
                            else if (object.name.indexOf("_cs") != -1) {
                                units = "mA";
                            }
                            else{
                                 units = "V";
                            }
                            shapeValue.rawNode.textContent = value + " " + units;
                            }
                        }
                        shapeValue.setFill("black");

                    }
                },
            });
        });