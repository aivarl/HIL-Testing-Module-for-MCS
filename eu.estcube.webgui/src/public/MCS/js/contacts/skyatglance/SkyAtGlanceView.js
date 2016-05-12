define(['dojo/_base/declare', 
        'dojo/_base/lang', 
        'dojo/_base/array', 
        'dojo/_base/connect', 
        'dojo/dom-construct',
        'dojo/on', 
        'dojo/keys',
        'dojox/gfx',
        'dojox/layout/ExpandoPane', 
        'dojox/form/RangeSlider',
        'dijit/Tooltip', 
        'dijit/layout/BorderContainer',
        'dijit/layout/ContentPane', 
        'dijit/TitlePane', 
        'dijit/form/CheckBox',
        'dijit/form/ValidationTextBox',
        'common/store/MissionInformationStore',
        'common/store/ForEachStoreElement', 
        'common/formatter/TimeFormatter',
        'common/formatter/TimeDiffFormatter', 
        'common/formatter/DoubleFormatter', 
        'common/formatter/TimeFormatterS',
        'common/display/ObservableContentPane',
        'common/display/RadarViewContentProvider',
        'dojo/on'
        ],

    function (declare, Lang, Arrays, connect, DomConstruct, on, keys, Gfx, ExpandoPane, 
              RangeSlider, Tooltip, BorderContainer, ContentPane, TitlePane, CheckBox, ValidationTextBox, MissionInformationStore, 
              ForEachStoreElement, TimeFormatter, TimeDiffFormatter, DoubleFormatter,
              TimeFormatterS, ObservableContentPane, RadarViewContentProvider,on) {

        var msInHour = 1000 * 60 * 60;
        var msInDay = 24 * msInHour;

        var conf = config.SKYATGLANCE;

        return declare([], {
            constructor: function(args) {
                this.radarView  = new RadarViewContentProvider({id:"sky"});
                this.mainContainer = DomConstruct.create('div');
                this.plotContainer = DomConstruct.create('div', {}, this.mainContainer);


                this.plotPane = new ObservableContentPane({
                    region: 'center',
                    style: {
                        width: '100%',
                        margin: '0px',
                        padding: '0px',
                        left: '0px',
                        top: '0px'
                    }
                }, this.plotContainer);

                this.controlPane = new ExpandoPane({
                   region: 'right',
                   style: {
                       width: '250px',
                       height: '100%'
                   }
                });

                this.satelliteSelectionPane = new TitlePane({
                    title: 'Satellites'
                });
                
                this.groundStationSelectionPane = new TitlePane({
                    title: 'Ground stations',
                    style: { 'margin-top': '5px' }
                });
                
                this.radarViewPane = new TitlePane({
                    content: this.radarView.getContent(),
                    title: 'Radar view',
                    style: { 'margin-top': '5px'}
                });

                this.sliderRangeContentPane = new ContentPane({
                    align: "middle",
                    style: {
                        margin: "0px",
                        padding: "5px",
                    }
                });

                this.slider = new dojox.form.HorizontalRangeSlider({
                    name: "rangeSlider",
                    value: [0,12],
                    minimum: 0,
                    maximum: 24,
                    intermediateChanges: true,
                    style: "width:230px;",
                    onChange: Lang.hitch(this, function(value){
                        conf.timeRange[0] = value[0];
                        conf.timeRange[1] = value[1];
                        this.replot();
                    })
                }, "rangeSlider");
                
                calculateSliderValue = function(hoursMinutes){
                    var timeNow = Date.now();
                    var dateNow = new Date(timeNow);
                    dateNow.setHours(hoursMinutes.split(":")[0], hoursMinutes.split(":")[1], 0);
                    var startTime = dateNow.getTime();
                    var hoursFromTimeFrame = (startTime - timeNow)/msInHour;
                    if(hoursFromTimeFrame < 0){
                        hoursFromTimeFrame += 24;
                    };
                    return hoursFromTimeFrame;
                };
                
                changeSliderStartValue = Lang.hitch(this, function(value){
                    var sliderValues = this.slider.get("value");
                    var sliderValue2 = sliderValues[1];
                    var sliderValue1 = calculateSliderValue(value);
                    this.slider.set("value", [sliderValue1, sliderValue2]);
                });
                
                this.startTimeFrame = new ValidationTextBox({
                    id : "startTimeFrame",
                    value: "",
                    placeHolder: "start time (HH:mm)",
                    pattern: "([0-1][0-9]|[2][0-3])[:]([0-5][0-9])",
                    style: {
                        width: "70px"
                    },
                    invalidMessage: "Use HH:mm format",
                    onChange: Lang.hitch(this, function (value) {
                        changeSliderStartValue(value);
                    }),
                    onKeyDown: Lang.hitch(this, function(event) {
                        if(event.keyCode == keys.ENTER){
                            dijit.byId("endTimeFrame").focus();
                            changeSliderStartValue(startTimeFrame.value);
                        }
                        if(event.keyCode == keys.TAB){
                            changeSliderStartValue(startTimeFrame.value);
                        }
                    })
                }, "startTimeFrame");
                
                changeSliderEndValue = Lang.hitch(this, function(value){
                    var sliderValues = this.slider.get("value");
                    var sliderValue1 = sliderValues[0];
                    var sliderValue2 = calculateSliderValue(value);
                    this.slider.set("value", [sliderValue1, sliderValue2]);
                });
                
                this.endTimeFrame = new ValidationTextBox({
                    id : "endTimeFrame",
                    value: "",
                    placeHolder: "end time (HH:mm)",
                    pattern: "([0-1][0-9]|[2][0-3])[:]([0-5][0-9])",
                    invalidMessage: "Use HH:mm format",
                    style: {
                        width: "70px"
                    },
                    onChange: Lang.hitch(this, function (value) {
                        changeSliderEndValue(value);
                    }),
                    onKeyDown: function(event) {
                        if(event.keyCode == keys.ENTER){
                            changeSliderEndValue(endTimeFrame.value);
                        }
                        if(event.keyCode == keys.TAB){
                            changeSliderEndValue(endTimeFrame.value);
                        }
                    }
                }, "endTimeFrame");
                
                this.sliderPane = new TitlePane({
                    content: this.slider,
                    title: 'Time frame',
                    style: { 'margin-top': '5px'}
                });
                
                this.sliderRangeContentPane.addChild(this.startTimeFrame);
                this.sliderRangeContentPane.addChild(this.endTimeFrame);
                this.sliderPane.addChild(this.sliderRangeContentPane);
                this.controlPane.addChild(this.sliderPane);
                this.controlPane.addChild(this.satelliteSelectionPane);
                this.controlPane.addChild(this.groundStationSelectionPane);
                this.controlPane.addChild(this.radarViewPane);

                this.layout = new BorderContainer({
                    style: {
                        width: '100%',
                        height: '100%',
                        margin: '0px',
                        padding: '2px'
                    }
                }, this.mainContainer);
                
                this.layout.addChild(this.plotPane);
                this.layout.addChild(this.controlPane);
                
                // if gsData[gsid].hidden, then do not draw contacts for GS #gsid
                // id -> {hidden : bool, y : int}
                this.gsData = {};
                
                // id -> {hidden: bool}
                this.satData = {};
                
                this.surface = null;
                this.visible = false;
                
                ReplotIfVisible = Lang.hitch(this, function() {
                    if(this.visible) {
                        this.replot();
                    }
                });
                
                setInterval(ReplotIfVisible, config.SKYATGLANCE.updateInterval);
                
                // id -> GS
                this.groundStations = {};
                // id -> Sat
                this.satellites = {};
                
                this.gsOrder = [];
                this.satOrder = [];
                
                // id -> { visible: boolean, y: int, numberAmongVisible: int }
                this.gsStatus = {};
                this.satStatus = {};
                
                // Needed just to find out to which contact attach the label with satellite name
                // gsId -> satId -> { contact, shape }
                this.firstContacts = {};
                
                ForEachStoreElement(MissionInformationStore.query({ class: "GroundStation" }), Lang.hitch(this, function(gs) {
                    this.groundStations[gs.ID] = gs;
                    this.gsOrder.push(gs.ID);
                    this.gsStatus[gs.ID] = {
                        visible: true, 
                        color: conf.colors[(this.gsOrder.length-1) % conf.colors.length]
                    };
                    
                    this.firstContacts[gs.ID] = {};
                    
                    Arrays.forEach(this.satOrder, Lang.hitch(this, function(satId) {
                        this.firstContacts[gs.ID][satId] = { contact: null, shape: null };
                    }));
                    
                    if(this.visible) {
                        this.recalculateStatus();
                        this.replot();
                    }
    
                    this.addGroundStationCheckbox(gs);
                }));
    
                ForEachStoreElement(MissionInformationStore.query({ class: "Satellite"}), Lang.hitch(this, function(sat) {
                    this.satellites[sat.ID] = sat;
                    this.satOrder.push(sat.ID);
                    this.satStatus[sat.ID] = { 
                        visible: true,
                        color: conf.colors[(this.satOrder.length - 1) % conf.colors.length]
                    };
                    
                    Arrays.forEach(this.gsOrder, Lang.hitch(this, function(gsId) {
                        this.firstContacts[gsId][sat.ID] = { contact: null, shape: null };
                    }));
    
                    if(this.visible) {
                        this.recalculateStatus();
                        this.replot();
                    }
    
                    this.addSatelliteCheckbox(sat);
                }));
                
                
                
                this.contactListenerHandle = null;
                
                on(this.plotPane, "resized", Lang.hitch(this, function() {
                    this.createPlot(this.plotContainer);
                }));
            },
            
            recalculateStatus: function() {
                var hidden = 0;
                
                for(var number = 0; number < this.satOrder.length; number++) {
                    var satID = this.satOrder[number];
                    
                    if(this.satStatus[satID].visible) {
                        var n = number - hidden;
                        this.satStatus[satID].numberAmongVisible = n;
                        this.satStatus[satID].y = conf.spacing + n * (conf.spacing + conf.contactBoxHeight);
                    } else {
                    	
                        hidden++;
                    }
                }
                
                var visibleSatellitesCount = this.satOrder.length - hidden;
                
                hidden = 0;
                
                // TODO: DRY
                for(var number = 0; number < this.gsOrder.length; number++) {
                    var gsID = this.gsOrder[number];
                    
                    if(this.gsStatus[gsID].visible) {
                        var n = number - hidden;
                        this.gsStatus[gsID].numberAmongVisible = n;
                        this.gsStatus[gsID].y = conf.timelineHeight + conf.spacing + n * (conf.spacing + conf.groundStationHeadingHeight + 
                                visibleSatellitesCount * (conf.spacing + conf.contactBoxHeight));
                    } else {
                        hidden++;
                    }
                }
                
                Arrays.forEach(this.gsOrder, Lang.hitch(this, function(gsID) {
                    Arrays.forEach(this.satOrder, Lang.hitch(this, function(satID) {
                        if(this.firstContacts[gsID][satID].contact != null && this.firstContacts[gsID][satID].contact.endTime <= this.startTime) {
                            this.firstContacts[gsID][satID].contact = null;
                            this.surface.remove(this.firstContacts[gsID][satID].shape);
                        }
                    }));
                }));
            },
            
            addCheckbox: function(obj, parent, callback) {
                var cbPane = new ContentPane();
    
                var checkBox = new CheckBox({id : (obj.ID + "-cb-sag"), checked : true})
                
                checkBox.onChange = Lang.hitch(this,function(value) {
                    callback(value, obj);
                    this.clearRadarView(value,obj);
                });
    
                cbPane.addChild(checkBox);
                cbPane.domNode.appendChild(DomConstruct.create("label", {"for" : (obj.ID + "-cb-sag"), innerHTML : obj.name}));
    
                parent.addChild(cbPane);
            },
            
            clearRadarView:function(value,obj){
            	if(!value){    	
	            	var requestedLabel;
	            	
	            	if(obj.class == "GroundStation"){
	            		requestedLabel = "gsLabel";        		        		
	            	}
	            	else if(obj.class == "Satellite"){
	            		requestedLabel = "satLabel";         		
	            	}
	            	
	            	var labelElement = document.getElementById(requestedLabel);
	            	if (labelElement != null){
		            	var label = labelElement.textContent;
		            	var longLabelValue = label.split("/");
		            	var shortLabelValue = longLabelValue[longLabelValue.length - 1];
		            	
		            	var checkBoxLabel = obj.ID;
		            	var checkBoxLongLabelValue = checkBoxLabel.split("/");
		            	var checkBoxShorLabelValue = checkBoxLongLabelValue[checkBoxLongLabelValue.length - 1];
	  	
		            	if(shortLabelValue == checkBoxShorLabelValue){
		            		this.radarView.emptyRadarView();               		
		            	}
	            	}
            	} else {
            		this.radarView.getSatelliteTrajectoryFromContact(this.radarView.lastDefaultContactpass);
            	}            	
            	
            },
            
            addGroundStationCheckbox: function(gs) {
                this.addCheckbox(gs, this.groundStationSelectionPane, Lang.hitch(this, function(value) {
                    this.gsStatus[gs.ID].visible = value;
                    this.recalculateStatus();
                    this.replot();
                }));
            },
            
            addSatelliteCheckbox: function(sat) {
                this.addCheckbox(sat, this.satelliteSelectionPane, Lang.hitch(this, function(value) {
                    this.satStatus[sat.ID].visible = value;
                    this.recalculateStatus();
                    this.replot();
                }));
            },
            
            plotGS: function(gsID) {
                var y = this.gsStatus[gsID].y;
                var color = this.gsStatus[gsID].color;
                
                this.surface.createLine({x1: 0, y1: y, x2: this.surface.getDimensions().width, y2: y}).setStroke(color);
                this.surface.createText({x: 0, y: y + conf.groundStationHeadingHeight, text: this.groundStations[gsID].name}).setFill(color);
            },
            
            plotContact: function(contact) {
                var color = this.satStatus[contact.satelliteId].color;
                
                if(!this.gsStatus[contact.groundStationId].visible || !this.satStatus[contact.satelliteId].visible) {
                    return;
                }
                
                var x = this.timeToX(Math.max(contact.startTime, this.startTime));
                var y = this.gsStatus[contact.groundStationId].y + this.satStatus[contact.satelliteId].y + 
                            + conf.groundStationHeadingHeight;
                    
                var rect = {
                    x: x,
                    y: y,
                    width: this.timeToX(contact.endTime) - x,
                    height: conf.contactBoxHeight
                };
                
                var contactRect = this.surface.createRect(rect).setFill(color);
                this.surface.createText({
                    text: contact.orbitNumber.toString(),
                    x: this.timeToX(contact.startTime) - conf.orbitNumberTextOffset,
                    y: y + conf.contactBoxHeight,
                    align: 'end',
                }).setFill(color);
                
                var fc = this.firstContacts[contact.groundStationId][contact.satelliteId];
                
                if(fc.contact.orbitNumber == contact.orbitNumber) {
                    if(fc.shape != null) {
                        this.surface.remove(fc.shape);
                    }
                    
                    this.firstContacts[contact.groundStationId][contact.satelliteId].shape = this.surface.createText({
                        text: this.satellites[contact.satelliteId].name,
                        x: this.timeToX(contact.endTime) + conf.satelliteLabelOffset,
                        y: y + conf.contactBoxHeight
                    }).setFill(color);
                }
                
                // XXX: Hack time! Based on http://jsfiddle.net/XQyy2/
                var rbox = contactRect.getTransformedBoundingBox();
                
                //Creating tool-tip with contents for events
                var tooltipContent = DomConstruct.create('div', {
                    class: 'contactTooltip'
                });
                


                DomConstruct.create('div', {
                    class: 'tooltip-field-sat',
                    innerHTML: 'Satellite: ' + this.satellites[contact.satelliteId].name
                }, tooltipContent);
                
                DomConstruct.create('div', {
                    class: 'tooltip-field-gs',
                    innerHTML: 'Groundstation: ' + this.groundStations[contact.groundStationId].name
                }, tooltipContent);
                
                DomConstruct.create('div', {
                    class: 'tooltip-field-orbit-number',
                    innerHTML: 'Orbit number: ' + contact.orbitNumber
                }, tooltipContent);
                
                DomConstruct.create('div', {
                    class: 'tooltip-field-start-time',
                    innerHTML: 'Start time: ' + TimeFormatter(contact.startTime)
                }, tooltipContent);
                
                DomConstruct.create('div', {
                    class: 'tooltip-field-end-time',
                    innerHTML: 'End time: ' + TimeFormatter(contact.endTime)
                }, tooltipContent);
                
                DomConstruct.create('div', {
                    class: 'tooltip-field-duration',
                    innerHTML: 'Duration: ' + TimeDiffFormatter(contact.startTime, contact.endTime)
                }, tooltipContent);
                
                DomConstruct.create('div', {
                    class: 'tooltip-field-short-numeric',
                    innerHTML: 'Max elevation: ' + DoubleFormatter(contact.elevation.max)
                }, tooltipContent);

                
                DomConstruct.create('div', {
                    class: 'tooltip-field-short-numeric',
                    innerHTML: 'Start azimuth: ' + DoubleFormatter(contact.azimuth.start)
                }, tooltipContent);
                
                DomConstruct.create('div', {
                    class: 'tooltip-field-short-numeric',
                    innerHTML: 'End azimuth: ' + DoubleFormatter(contact.azimuth.end)
                }, tooltipContent);
                
                DomConstruct.create('div', {
                    class: 'tooltip-field-unit', 
                    innerHTML: 'In Sun light: ' + contact.inSunLigth
                }, tooltipContent);

                var contactTooltip = {
                    content: tooltipContent.outerHTML,
                    around: {
                        x: rbox[1].x + container.offsetLeft,
                        y: rbox[1].y - Math.round((rbox[1].y - rbox[2].y) / 2) + container.offsetTop,
                        w: 1,
                        h: 1
                    },
                    position: ["after-centered", "before-centered"]
                }
               
                // TODO: Replace with dojo/on, when we migrate to 1.9
                on(contactRect,"mouseover", Lang.hitch(this,function(e) {
                   contactTooltip.around.y = e.pageY;
                   Tooltip.show(contactTooltip.content, contactTooltip.around, contactTooltip.position); 

                   var mouseOutHandler = on(contactRect,"mouseout", function() {
                      Tooltip.hide(contactTooltip.around);                      
                      dojo.disconnect(mouseOutHandler);
                   });
                }));
                
                on(contactRect,"click", Lang.hitch(this,function(e) {
                     this.radarView.getSatelliteTrajectoryFromContact(contact);                  
                     Tooltip.show(contactTooltip.content, contactTooltip.around, contactTooltip.position);

                }));
                
            },
            
            timeToX: function(t) {
                return Math.round(this.width * ((t - this.startTime) / (this.endTime - this.startTime)));
            },
            
            xToTime: function(x) {
                return Math.round((x / this.width) * (this.endTime - this.startTime) + this.startTime);
            },
            
            replot: function() {
                this.surface.clear();
                
                var width = this.width;
                var height = this.height;
                
                // Setup timeframe
                var timepoint = Date.now();
                
                this.startTime = conf.timeRange[0] * msInHour + timepoint;
                this.endTime = conf.timeRange[1] * msInHour + timepoint;
                
                // GS
                Arrays.forEach(this.gsOrder, function(gs) {
                    if(this.gsStatus[gs].visible) {
                        this.plotGS(gs);
                    }
                }, this);
                
                // Timeline
                this.plotTimeline();
                
                // Contacts
                if(this.contactListenerHandle != null) {
                    this.contactListenerHandle.cancel();
                }
                
                this.contactListenerHandle = ForEachStoreElement(MissionInformationStore.query(Lang.hitch(this, function(cont) {
                    return cont.class == "LocationContactEvent" && cont.startTime <= this.endTime && this.startTime <= cont.endTime
                })), Lang.hitch(this, function(contact) {
                    if(!(contact.groundStationId in this.groundStations) || !(contact.satelliteId in this.satellites)) {
                        return;
                    }
                    
                    var fc = this.firstContacts[contact.groundStationId][contact.satelliteId];
                    
                    if(fc.contact == null || fc.contact.startTime > contact.startTime) {
                        this.firstContacts[contact.groundStationId][contact.satelliteId].contact = contact;
                    }
                    
                    this.plotContact(contact);
                }));
            },
            
            plotTimeline: function() {
                var timelineRect = this.surface.createRect({
                    x: 0,
                    y: 0,
                    width: this.width,
                    height: conf.timelineHeight
                }).setFill('#0000FF');
                
                var markery2 = conf.timelineHeight;
                var markery1 = markery2 - conf.timelineHourMarkerHeight;
                
                var remainder = this.startTime % msInHour;
                
                
                for(var hourMilestone = this.startTime + (msInHour - remainder); hourMilestone <= this.endTime; hourMilestone += msInHour) {
                    var x = this.timeToX(hourMilestone);
                    this.surface.createLine({ 
                        x1: x,
                        y1: markery1,
                        x2: x,
                        y2: markery2
                    }).setStroke({color: 'white', width: 3});
                    
                    this.surface.createText({
                        x: x,
                        y: markery1,
                        text: TimeFormatterS(new Date(hourMilestone)),
                        align: 'middle'
                    }).setFill('white');
                }
                
                for(var halfhour = this.startTime + (Math.floor(msInHour * 0.5) - remainder); halfhour <= this.endTime; halfhour += msInHour) {
                    var x = this.timeToX(halfhour);
                    
                    markery1 = markery2 - conf.timelineHalfHourMarkerHeight;
                    
                    this.surface.createLine({ 
                        x1: x,
                        y1: markery1,
                        x2: x,
                        y2: markery2
                    }).setStroke({color: 'white', width: 2});
                    
                    if(conf.timeRange[1]-conf.timeRange[0]<=10){
                        this.surface.createText({
                            x: x,
                            y: markery1,
                            text: TimeFormatterS(new Date(halfhour)),
                            align: 'middle'
                        }).setFill('white');
                    }
                }
                
                if(conf.timeRange[1]-conf.timeRange[0]<=10){
                    for(var quarterhour = this.startTime + (Math.floor(msInHour * 0.25) - remainder); quarterhour <= this.endTime; quarterhour += msInHour/2) {
                        var x = this.timeToX(quarterhour);
                        
                        markery1 = markery2 - conf.timelineHalfHourMarkerHeight/2;
                        
                        this.surface.createLine({ 
                            x1: x,
                            y1: markery1,
                            x2: x,
                            y2: markery2
                        }).setStroke({color: 'white', width: 1});
                        
                        if(conf.timeRange[1]-conf.timeRange[0]<=5){
                            this.surface.createText({
                                x: x,
                                y: markery1,
                                text: TimeFormatterS(new Date(quarterhour)),
                                align: 'middle'
                            }).setFill('white');
                        }
                    }
                }

                PlotTimeSelector = Lang.hitch(this, function(x) {
                    return this.surface.createLine({
                        x1: x,
                        y1: 0,
                        x2: x,
                        y2: this.height
                    }).setStroke({
                        width: 1,
                        color: "#FF8000"
                    });
                });
                
                var timeSelector = PlotTimeSelector(Math.round(this.width / 2));
                
                var timeLabelParameters = {
                    text: TimeFormatter(Math.round((this.startTime + this.endTime) / 2)),
                    x: conf.timeLabelX,
                    y: this.height - conf.timeLabelYOffset
                }

                this.timeLabel = this.surface.createText(timeLabelParameters).setFill('blue');

                on(this.plotPane, "mousemove", Lang.hitch(this, function(e) {
                    this.surface.remove(this.timeLabel);

                    if (e.clientX <= this.width) {
                        this.surface.remove(timeSelector);
                        timeSelector = PlotTimeSelector(e.clientX);
                        timeLabelParameters.text = TimeFormatter(this.xToTime(e.clientX));
                        this.timeLabel = this.surface.createText(timeLabelParameters).setFill('blue');
                    }
                }));
            },

            createPlot: function(container) {
                // TODO - 28.06.2013, Filipp - need this shameful scaling becouse of some
                // sneaky margin/padding. If the dimensions are left as-is, scrollbars appear
                this.width = Math.floor(container.offsetWidth * 0.995);
                this.height = Math.floor(container.offsetHeight * 0.99);

                if (this.surface != null) {
                    this.surface.destroy();
                }

                this.surface = Gfx.createSurface(container, this.width, this.height);
                this.recalculateStatus();

                this.surface.whenLoaded(null, Lang.hitch(this, this.replot));
            },

            placeAt: function(container) {
                DomConstruct.place(this.mainContainer, container);
                this.layout.startup();
                this.visible = true;
                // resizing also calls createPlot, so creating plot would happen twice if it was also called here)
                // this.createPlot(this.plotContainer);
                this.radarView.restyleRadarView();
                this.radarView.getPositionOfElementInAPage("sky");
                this.radarView.getFirstContactData();
            },

            hide: function() {
                this.visible = false;
            }
        })
    }
);