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
        "dojox/gfx",
        "dojox/gfx/fx",
        'dojo/on',
        "dojo/dom",
        'common/store/MissionInformationStore',
        'common/store/ForEachStoreElement', 
        
        ], 
        
        function(declare, DomConstruct, DomAttr, ContentPane, ContentProvider, declare, DomClass, DomConstruct,On, Lang, Request, gfx, fx, on,dom,MissionInformationStore,ForEachStoreElement) {   
            return declare(ContentProvider, {getContent: function () {
                this.radarPane = new ContentPane({
                    id: this.id,
                    region: "center",
                    style: {
                        margin: "0px",
                        padding: "0px",
                    }
                });

                this.trajectory;
                this.groundStation;
                this.satellite;
                this.orbit;
                this.lastDefaultContactpass;
                

                this.surface = dojox.gfx.createSurface(this.radarPane.domNode, this.surfaceX, this.surfaceY);
                this.surface.rawNode.id = this.id +"surface";

                
                this.trackingGenerated = {};
                this.currentTracker = [];
                return this.radarPane;
            },

            restyleRadarView:function(){
                 radarView = document.getElementById(this.id);
                 parentElement = radarView.parentNode;
                 width = parentElement.offsetWidth;


                 this.radarPane.style.width = width+"px";
                 this.radarPane.style.height = width+"px";
                 
                 parentElement.style.height = width+"px";
                 radarView.style.width = width+"px";

                 surface = document.getElementById(this.id +"surface");
                 surface.style.height = width+"px";
                 surface.style.width = width+"px";

      


                 this.surfaceX = width;
                 this.surfaceY = width;

                 this.circleX = width/2;
                 this.circleY = width/2;
                 this.circleR = width*0.4;
                 this.drawRadarView();
            },


            getSatelliteTrajectoryFromContact: function (contact) {
            	this.lastDefaultContactpass = {"instanceID":contact.instanceID,"orbitNumber":contact.orbitNumber,"startTime":contact.startTime,"endTime":contact.endTime};
                console.log("[radarViewContentProvider]: asking server for the trajectory on orbit number " + contact.orbitNumber)
                var startTime = 0;
                var endTime = 0;
                var trajectoryAdopted = [];
                Request.get("/getTrajectory", {
                    query: {
                        instanceId: contact.instanceID
                    },
                    handleAs: "json"
                }).then(Lang.hitch(this, function (response) {
                    this.trajectory = response;
                    
                    //Because the last trajectory point isn't the same as the contact end time, this makes the radar refresh properly
                    this.trajectory[this.trajectory.length - 1].timestamp = contact.endTime;
                    
                    console.log("[radarViewContentProvider]: received trajectory from the server");
                    startTime = this.getTimeLabel(contact.startTime);
                    startTime = startTime.hours + ":" + startTime.minutes + ":" + startTime.seconds;
                    endTime = this.getTimeLabel(contact.endTime);
                    endTime = endTime.hours + ":" + endTime.minutes + ":" + endTime.seconds;
                    trajectoryAdopted = this.getCoordinates(this.trajectory);
                    this.orbit = contact.orbitNumber;

                    this.emptyRadarView();

                    var gsLabel = this.surface.createText({
                        x: 0,
                        y: 10,
                        text: this.groundStation,
                    }).setFont({
                        size: this.fontSizeGroud - 5,
                        family:"Arial"
                    }).setFill("black");

                    gsLabel.rawNode.id = "gsLabel";
                    
                    var satLabel = this.surface.createText({
                        x: this.surfaceX-90,
                        y: 10,
                        text: this.satellite,
                    }).setFont({
                        size: this.fontSizeGroud - 5,
                        family:"Arial"
                    }).setFill("black");

                    satLabel.rawNode.id = "satLabel";
                    
                    var orbitLabel = this.surface.createText({
                    	 x: this.surfaceX-90,
                         y: this.surfaceY -5,
                        text: "orbit: "+this.orbit,
                    }).setFont({
                        size: this.fontSizeGroud - 5,
                        family:"Arial"
                    }).setFill("black");

                    orbitLabel.rawNode.id = "orbitLabel";

                    var azLabel = this.surface.createText({
                        x: 0,
                        y: this.surfaceY - 20,
                        text: "",
                    }).setFont({
                        size: this.fontSizeGroud - 5,
                        family:"Arial"
                    }).setFill("black");
                    azLabel.rawNode.id = "azLabel";

                    var middleX = trajectoryAdopted[Math.round(trajectoryAdopted.length / 2)].x;
                    var startX = trajectoryAdopted[0].x;
                    var endX = trajectoryAdopted[0].y;
                    if (middleX < this.circleX) {
                        kof = 40 / 5;
                    }
                    else {
                        kof = 50 * (-1);
                    }

                    var startTimeLabel = this.surface.createText({
                        x: startX + kof,
                        y: endX,
                        text: startTime,
                    }).setFont({
                        size: this.fontSizeGroud,
                        family:"Arial"
                    }).setFill("black");

                    startTimeLabel.rawNode.id = "startTimeLabel";
                    
                    on(startTimeLabel, "mousemove", Lang.hitch(this, function (e) {
                    	var insideRadarCircle = this.insideRadarCircle(startTimeLabel);
                    	if(insideRadarCircle){
	                        this.getMainRadarCircleLogics(true, e);
	                        on(startTimeLabel, "mouseout", Lang.hitch(this, function (e) {
	                            this.getMainRadarCircleLogics(false, e);
	                        }));
                    	}
                    }));

                    var endTimeLabel = this.surface.createText({
                        x: trajectoryAdopted[trajectoryAdopted.length - 1].x + kof,
                        y: trajectoryAdopted[trajectoryAdopted.length - 1].y,
                        text: endTime,
                    }).setFont({
                        size: this.fontSizeGroud,
                        family:"Arial"
                    }).setFill("black");
                    
                    on(endTimeLabel, "mousemove", Lang.hitch(this, function (e) {
                    	var insideRadarCircle = this.insideRadarCircle(endTimeLabel);
                    	if(insideRadarCircle){
	                        this.getMainRadarCircleLogics(true, e);
	                        on(endTimeLabel, "mouseout", Lang.hitch(this, function (e) {
	                            this.getMainRadarCircleLogics(false, e);
	                        }));
                    	}
                    }));

                    endTimeLabel.rawNode.id = "endTimeLabel";

                    var elLabel = this.surface.createText({
                        x: 0,
                        y: this.surfaceY - 5,
                        text: "",
                    }).setFont({
                        size: this.fontSizeGroud - 5,
                        family:"Arial"
                    }).setFill("black");

                    elLabel.rawNode.id = "elLabel";
                    for (var index = 1; index < trajectoryAdopted.length; index++) {
                    	var data = this.trajectory[index];
                    	var prevdata = this.trajectory[index-1];
                    	var color;
                    	if (data.eclipse > 0 && prevdata.eclipse > 0) { // BOTH IN SUNLIGHT
                    		color = "red";
                    	} else if (data.eclipse > 0 || prevdata.eclipse > 0) { // ONE IN SUNLIGHT
                    		color = "#800080";
                    	} else { // NEITHER IN SUNLIGHT
                    		color = "blue";
                    	}
                    	var trajectoryLine = this.surface.createLine({
                            x1: trajectoryAdopted[index].x,
                            y1: trajectoryAdopted[index].y,
                            x2: trajectoryAdopted[index-1].x,
                            y2: trajectoryAdopted[index-1].y
                        }).setStroke({
                            color: color,
                            width: 2
                        });
                        trajectoryLine.rawNode.id = "trajectoryLineDrawing" + index;
                        on(trajectoryLine, "mousemove", Lang.hitch(this, function (e) {
                            this.getMainRadarCircleLogics(true, e);
                            on(trajectoryLine, "mouseout", Lang.hitch(this, function (e) {
                                this.getMainRadarCircleLogics(false, e);
                            }));
                        }));
                    }
                    this.showSatellitePosition(this.trajectory, contact.instanceID);
                    //getElementsByTagName('')
                }));

            },

            getTimeLabel: function (timestamp) {
                function ifSingle(time) {
                    if (time.toString().length == 1) {
                        time = "0" + time;
                    }
                    return time;
                }
                var date = new Date(timestamp);
                var hours = ifSingle(date.getHours());
                var minutes = ifSingle(date.getMinutes());
                var seconds = ifSingle(date.getSeconds());

                return {
                    "hours": hours,
                    "minutes": minutes,
                    "seconds": seconds
                };

            },
            
            getCurrentSatellitePoint: function(trajectory) {
            	var currentTime = new Date().getTime();
                var i = 0;
                for (i = 0; i < trajectory.length; i++) {
                	if (currentTime < trajectory[i].timestamp) {
                		break;
                	}
                }
                return i;
            },

            showSatellitePosition: function (trajectory, instanceId) {
                this.currentTracker = instanceId;
                var i = this.getCurrentSatellitePoint(trajectory);	
                if (!(instanceId in this.trackingGenerated)) {
                    this.trackingGenerated[instanceId] = i;
                    (Lang.hitch(this, function () {		
                        if (instanceId == this.currentTracker) {	
                            if (this.trackingGenerated[instanceId] < trajectory.length) {	
                                this.drawTrajectoryPoint(this.trackingGenerated[instanceId], trajectory);    

                                var currentTime = new Date().getTime();
                                var pointTime = trajectory[this.trackingGenerated[instanceId]].timestamp;
                                var when = pointTime - currentTime;
                                if (when < 0) {
                                    when = 10;
                                }
                                this.trackingGenerated[instanceId]++;
                                
                                console.log("[RadarViewContentProvider] " + i + " next satellite position update in " + Math.round(when / 1000) + " seconds");
                                setTimeout(Lang.hitch(this, arguments.callee), when);

                            } else {
                            	this.drawTrajectoryPoint(0, trajectory);
                                this.getFirstContactData();
                            }
                        }
                    }))();
                } else {
                	this.drawTrajectoryPoint(i, trajectory);
                }
            },
            
            drawTrajectoryPoint: function(i, trajectory) {
                var oldSpot = document.getElementById("satelliteSpot");
                if (oldSpot != null) {
                    oldSpot.parentNode.removeChild(oldSpot);
                }
            	if (i != 0) {
                	var azimuth = trajectory[i].azimuth;
                	var elevation = trajectory[i].elevation;
                	var rect = this.tranformPolarToRectangCoordinates(azimuth, elevation);
                    var circle = this.surface.createCircle({
                        cx: rect.sphericX,
                        cy: rect.sphericY,
                        r: 5
                    }).setFill("red").setStroke({
                        color: "blue",
                        width: 1
                    });
                    on(circle, "mousemove", Lang.hitch(this, function (e) {
                        this.getMainRadarCircleLogics(true, e);
                        on(circle, "mouseout", Lang.hitch(this, function (e) {
                            this.getMainRadarCircleLogics(false, e);
                        }));
                    }));
                    circle.rawNode.id = "satelliteSpot";
                }
            },
            
            insideRadarCircle: function(object){
            	var x = parseInt(object.rawNode.attributes.x.value);
            	var y = parseInt(object.rawNode.attributes.y.value);
            	
            	var distance = Math.sqrt((x-this.circleX)*(x-this.circleX)+(y-this.circleY)*(y-this.circleY));
            	if(distance>this.circleR){
            		return false;
            	}
            	else{
            		return true;
            	}
            	
            },

            getFirstContactData:function(){
            	var currTime = Date.now();
                shortestContact = null;
                 ForEachStoreElement(MissionInformationStore.query({class:"LocationContactEvent"}), Lang.hitch(this, function(contact) {
                	 if (currTime < contact.endTime && (shortestContact == null || shortestContact.startTime > contact.startTime)){
                		 	shortestContact = contact;
                	 }
                }));
                if (shortestContact != null)
                	this.getSatelliteTrajectoryFromContact(shortestContact); 
            },

            getCoordinates: function (trajectory) {
                var adoptedTrajectory = [];
                var azimuth = 0;
                var elevation = 0;

               
                var gsRawName = trajectory[0].groundStationName;
                var gsIdParts = gsRawName.split("/");
                
             

                var satRawName = trajectory[0].satelliteName;
                var satIdParts = satRawName.split("/");

                
                this.groundStation = gsIdParts[gsIdParts.length - 1];
                this.satellite = satIdParts[satIdParts.length - 1];
         

                for (var i = 0; i < trajectory.length; i++) {
                    azimuth = trajectory[i].azimuth;
                    elevation = trajectory[i].elevation;

                    var rectCoordinates = this.tranformPolarToRectangCoordinates(azimuth, elevation);

                    adoptedTrajectory.push({
                        x: rectCoordinates.sphericX,
                        y: rectCoordinates.sphericY
                    });
                }

                return adoptedTrajectory;

            },

            tranformPolarToRectangCoordinates: function (azimuth, elevation) {

                var degrX = Math.cos(this.toRadians(azimuth - 90));
                var degrY = Math.sin(this.toRadians(azimuth - 90));
                var x = (this.circleR * degrX + this.circleX);
                var y = (this.circleR * degrY + this.circleY);
                var deltaX = this.circleX - x;
                var kofX = deltaX / 90;
                var deltaY = this.circleY - y;
                var kofY = deltaY / 90;
                var actX = x + elevation * kofX;
                var sphericX = actX;
                var actY = y + (elevation * kofY);
                var sphericY = actY;

                return {
                    "sphericX": sphericX,
                    "sphericY": sphericY
                };

            },

            updateAzElLabel: function (x, y) {
                var azLabel = dom.byId("azLabel");
				var elLabel = dom.byId("elLabel");
				if (azLabel != null || elLabel != null) {
					var x0 = this.circleX;
					var y0 = this.circleY;
					y = y0 - y;
					x = x - x0;

					var R = Math.sqrt(y * y + x * x);

					var tanT = x / y;
					var azimuth = Math.round(this.toDegrees(Math.atan(tanT)));

					if (x == 0 && y == 0) {
						azimuth = 0;
					} else if (x < 0 && y >= 0) {
						azimuth += 360;
					} else if (y < 0) {
						azimuth += 180;
					}

					var elevation = (Math.round(R * 90 / this.circleR) - 90) * (-1);

					if (elevation < 0) {
						elevation = elevation * (-1);
					}

					if (azLabel != null && azLabel.textContent != null) {
						azLabel.textContent = "az: " + azimuth + "Ā°";
					}
					if (elLabel != null && elLabel.textContent != null) {
						elLabel.textContent = "el: " + elevation + "Ā°";
					}
				}
            },

            emptyAzElLabels: function () {
                var azLabel = dom.byId("azLabel");		
				var elLabel = dom.byId("elLabel");		
				if (azLabel != null) {
					azLabel.textContent = "";
				}
				if (elLabel != null){
					elLabel.textContent = "";
				}
            },

            getMainRadarCircleLogics: function (update, e) {
                if (update) {
                    var pos = this.getPosition();
                    var clientX = e.clientX - pos[0];
                    var clientY = e.clientY - pos[1];
                    this.updateAzElLabel(clientX, clientY);
                }
                else {
                    this.emptyAzElLabels();
                }
            },
            
            getPosition: function() {
                var element = document.getElementById(this.id);
                for (var posX = 0, posY = 0; element; element = element.offsetParent) {
                	posX += parseInt(element.offsetLeft) - parseInt(element.scrollLeft);
                	posY += parseInt(element.offsetTop) - parseInt(element.scrollTop);
                }
                return [ posX, posY ];
            },
            
            drawRadarView: function () {
				this.surface.clear();
                var firstCircle = this.surface.createCircle({
                    cx: this.circleX,
                    cy: this.circleY,
                    r: this.circleR
                }).setFill("white").setStroke({
                    color: "#B8BCC1",
                    width: 1.5
                });

                on(firstCircle, "mousemove", Lang.hitch(this, function (e) {
                    this.getMainRadarCircleLogics(true, e);
                    on(firstCircle, "mouseout", Lang.hitch(this, function (e) {
                        this.getMainRadarCircleLogics(false, e);
                    }));
                }));

                var secondCircle = this.surface.createCircle({
                    cx: this.circleX,
                    cy: this.circleY,
                    r: this.circleR*0.65
                }).setFill("white").setStroke({
                    color: "#B8BCC1",
                    width: 1.5
                });

                on(secondCircle, "mousemove", Lang.hitch(this, function (e) {
                    this.getMainRadarCircleLogics(true, e);
                    on(secondCircle, "mouseout", Lang.hitch(this, function (e) {
                        this.getMainRadarCircleLogics(false, e);
                    }));
                }));

                var thirdCircle = this.surface.createCircle({
                    cx: this.circleX,
                    cy: this.circleY,
                    r: this.circleR *0.3
                }).setFill("white").setStroke({
                    color: "#B8BCC1",
                    width: 1.5
                });

                on(thirdCircle, "mousemove", Lang.hitch(this, function (e) {
                    this.getMainRadarCircleLogics(true, e);
                    on(thirdCircle, "mouseout", Lang.hitch(this, function (e) {
                        this.getMainRadarCircleLogics(false, e);
                    }));
                }));

                var horizontalLine = this.surface.createLine({
                    x1: this.circleX - this.circleR,
                    y1: this.circleY,
                    x2: this.circleX + this.circleR,
                    y2: this.circleY
                }).setStroke({
                    color: "#B8BCC1",
                    width: 1.5
                });

                on(horizontalLine, "mousemove", Lang.hitch(this, function (e) {
                    this.getMainRadarCircleLogics(true, e);
                    on(horizontalLine, "mouseout", Lang.hitch(this, function (e) {
                        this.getMainRadarCircleLogics(false, e);
                    }));
                }));

                var verticalLine = this.surface.createLine({
                    x1: this.circleX,
                    y1: this.circleY - this.circleR,
                    x2: this.circleX,
                    y2: this.circleY + this.circleR,
                }).setStroke({
                    color: "#B8BCC1",
                    width: 1.5
                });

                on(verticalLine, "mousemove", Lang.hitch(this, function (e) {
                    this.getMainRadarCircleLogics(true, e);
                    on(verticalLine, "mouseout", Lang.hitch(this, function (e) {
                        this.getMainRadarCircleLogics(false, e);
                    }));
                }));

                var north = this.surface.createText({
                    x: this.circleX - 5,
                    y: this.circleY - this.circleR - 3,
                    text: "N",
                }).setFont({
                    size: this.fontSizeGroud,
                    family:"Arial"
                }).setFill("black");

                var east = this.surface.createText({
                    x: this.circleX + this.circleR + 5,
                    y: this.circleY + 5,
                    text: "E",
                }).setFont({
                    size: this.fontSizeGroud,
                    family:"Arial"
                }).setFill("black");

                var west = this.surface.createText({
                    x: this.circleX - this.circleR - 15,
                    y: this.circleY + 5,
                    text: "W",
                }).setFont({
                    size: this.fontSizeGroud,
                    family:"Arial"
                }).setFill("black");

                var south = this.surface.createText({
                    x: this.circleX - 3,
                    y: this.circleY + this.circleR + 13,
                    text: "S",
                }).setFont({
                    size: this.fontSizeGroud,
                    family:"Arial"
                }).setFill("black");

            },

            toRadians: function (degrees) {
                return degrees * Math.PI / 180;
            },

            toDegrees: function (radians) {
                return radians * 180 / Math.PI;
            },
            
            emptyRadarView: function(){
            	 var gsLabel = document.getElementById("gsLabel");
                 var satLabel = document.getElementById("satLabel");
                 var orbitLabel = document.getElementById("orbitLabel");
                 var oldStartTime = document.getElementById("startTimeLabel");
                 var oldEndTime = document.getElementById("endTimeLabel");
                 var oldSpot = document.getElementById("satelliteSpot");
                 if (gsLabel != null) {
                     gsLabel.parentNode.removeChild(gsLabel);
            	 }
                 if (satLabel != null) {
                     satLabel.parentNode.removeChild(satLabel);
		       	 }
	             if (orbitLabel != null) {
                     orbitLabel.parentNode.removeChild(orbitLabel);
             	 }
	             if (oldStartTime != null) {
                     oldStartTime.parentNode.removeChild(oldStartTime);
	             }
	             if (oldEndTime != null) {
                     oldEndTime.parentNode.removeChild(oldEndTime);
            	 }
                 if (oldSpot != null) {
                     oldSpot.parentNode.removeChild(oldSpot);
                 }
	             if (this.surface != null) { // REMOVING TRAJECTORY LINES
	            	 var children = this.surface.children;
	            	 for(var i = 0; i < children.length; i++) {
	            		 if (children[i].rawNode.id.lastIndexOf("trajectoryLineDrawing", 0) == 0) {
	            			 children[i].removeShape();
	            			 i--;
	            		 }
	            	 }
	             }
            },
            getPositionOfElementInAPage: function(elementId){
                    var element =document.getElementById(elementId);
                    var offsets = element.getBoundingClientRect();
                    var top = offsets.top;
                    var left = offsets.left;
                    element.y = top;
                    element.x = left;
                    return [top,left];
                },
            });
            });
