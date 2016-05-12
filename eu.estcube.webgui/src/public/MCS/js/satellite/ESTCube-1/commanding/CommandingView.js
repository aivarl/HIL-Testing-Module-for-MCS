define([
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
    "dijit/layout/BorderContainer",
    "common/display/CommandsContentProvider",
    "common/display/Ax25ViewContentProvider",
    "common/display/TelemetryContentProvider",
   ],

    function(declare, DomClass, DomConstruct, On, Lang, Request, Form, Button, ValidationTextBox, SimpleTextarea, ContentPane, TableContainer, Select, Grid, ItemFileReadStore, Json, Config, DateFormatter, Memory, FilteringSelect,BorderContainer,CommandsContentProvider, Ax25ViewContentProvider,ParametersView) {

        return declare([], {

            constructor: function (args) {
             
                this.mainContainer = DomConstruct.create("div",{
                		id:"mainContainer" ,
                		style: {                
	                		width: "100%",
	                        height: "36%"
                   }});
                   
              var commandsPane = new ContentPane({ 
                     content:"<commandInfo style=font-weight:bold;'>Send Commands<br\> </commandInfo>",
                     id:"commandsPane",
                     region: "left", 
                     style: {
                         height:"100%",
                         width:"48.5%",
                         margin: "3px",
                         padding: "3px"
                         
                     }
                 });
               
              commandsPane.addChild(new CommandsContentProvider({initCdhs:true, cols:2, showCdhsInfo:true , initCommandingPageLogics: true , descriptionId:"commandingDescriptionId"}).getContent());

              
              var ax25ViewPane = new ContentPane({ 
            	  	 id:"ax25ViewPane",
                     content:"<commandInfo style=font-weight:bold;'>Send Hex<br\> <br\> </commandInfo>",
                     region: "right", 
                     style: {
                         margin: "3px",
                         padding: "3px",
                         width:"48.5%"
                     }
                 });
                         
              
              ax25ViewPane.addChild(new Ax25ViewContentProvider().getContent());
              
              this.bc = new BorderContainer({}, this.mainContainer);
              this.bc.addChild(commandsPane);
              this.bc.addChild(ax25ViewPane);

              
             
             
                
            },
            
            placeAt: function(container) {
                DomConstruct.place(this.mainContainer, container);
                this.bc.startup();
                
                commandsPane.style.height="0px";
                commandingBcHeight=  commandsPane.scrollHeight;
                commandsPane.style.height=commandingBcHeight + "px";
                

                var ax25ViewPane = document.getElementById("ax25ViewPane");
                ax25ViewPane.style.height="0px";
                var axBcHeight=  ax25ViewPane.scrollHeight;
                ax25ViewPane.style.height=axBcHeight+"px";    

                var mainContainer = document.getElementById("mainContainer");                                  
                mainContainer.style.height=axBcHeight +30 +"px";  
            }

            
        });
    }
);
