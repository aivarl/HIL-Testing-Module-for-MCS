define([
    "dojo/_base/declare", 
    "dojo/_base/lang", 
    "dojo/_base/array", 
    "dojo/aspect", 
    "dojo/dom-class",
    "dojo/on",
    "dgrid/OnDemandGrid", 
    "dgrid/util/misc", 
    "./ContentProvider", 
    "common/store/ParameterStore", 
    "common/store/SetParameterLevelColor", 
    "common/formatter/DateFormatter", 
    ], 
    function(declare, Lang, Arrays, Aspect, DomClass, on, Grid, Misc, ContentProvider, ParameterStore, SetParameterLevelColor, DateFormatter) {
        return declare(ContentProvider, {        
            grid: null,
            store: ParameterStore,        
            getContent: function (args) {
                declare.safeMixin(this, args);
                
                this.grid = new Grid({
                    class: this.domClasses,
                    columns: this.columns || {
                        name: {
                            label: "Name",
                            className: "field-short-name",
                        },
                        value: { label: "Value",
                            renderCell:function(object,value,node){
                                var res = value;
                                if(object.applicableTo.indexOf("ilm.ee")!=-1 && object.name === "Air Pressure"){
                                    res = parseInt(res) * 1.3332239;
                                }
                                if (res == undefined) {
                                    res = "";
                                } else if (!isNaN(parseFloat(res)) && isFinite(res)) {
                                    // round decimals to two places on only decimal values
                                    // Check if value is decimal
                                    if (res % 1 != 0) {
                                        res = res.toFixed(2);
                                    }
                                }
                                node.innerHTML = res;
                                SetParameterLevelColor(object, node);
                            }
                        },
                        unit: {
                            label: "Unit",
                            renderCell:function(object,value,node){
                                if(value!= undefined){
                                    var res = value;
                                    if(value.indexOf("^2")!=-1){
                                        var res = value.replace("^2"," &#178");
                                    }
                                    node.innerHTML = res;
                                }
                            }
                        },
                        timestamp: { 
                            label: "Time", formatter: DateFormatter
                             },
                        applicableTo: { 
                            label: "Source",
                            renderCell: function (object, value, node) {
                                var elements = object.applicableTo.split("/");
                                var id  = elements[elements.length-1];
                                node.innerHTML = id;
                            },

                             },
                    },
                    store: this.store,
                    query: this.query ||

                    function (message) {
                        var sources =[
                                      {"name":"Air Pressure","source":"meteo.physic.ut.ee"},
                                      {"name":"Air Pressure Trend","source":"ilm.ee"},
                                      {"name":"Air Temperature","source":"meteo.physic.ut.ee"},
                                      {"name":"Air Temperature Trend ","source":"ilm.ee"},
                                      {"name":"Wind Direction","source":"meteo.physic.ut.ee"},
                                      {"name":"Wind Speed","source":"meteo.physic.ut.ee"},
                                      {"name":"Maximum Wind Speed ","source":"emhi.ee"},
                                      {"name":"Phenomenon","source":"emhi.ee"},
                                      {"name":"Precipitations","source":"meteo.physic.ut.ee"},
                                      {"name":"Relative Humidity","source":"meteo.physic.ut.ee"},
                                      {"name":"Relative Humidity Trend","source":"ilm.ee"},
                                      {"name":"Visibility","source":"emhi.ee"},
                                      {"name":"Lux","source":"meteo.physic.ut.ee"},
                                      {"name":"Gamma","source":"meteo.physic.ut.ee"},
                                      {"name":"Sole","source":"meteo.physic.ut.ee"}
                                      ];
                        
                       		var messageSource = message.applicableTo.split("/");
                       		var messageName = message.name;
                       		messageSource = messageSource[messageSource.length-1];
                        	
                        	for(var i=0;i<sources.length;i++){
                        		var source = sources[i];
                        		if(source.name == messageName && source.source == messageSource){
                        			return true;
                            	}
                        	}
                        	
                    }
                });
                return this.grid;
            },

        });
    });
    



