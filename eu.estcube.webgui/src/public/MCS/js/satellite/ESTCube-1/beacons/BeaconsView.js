define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "common/store/BeaconStore",
    "dojo/dom-construct",
    "dijit/layout/BorderContainer",
    "dgrid/OnDemandList",
    "dgrid/OnDemandGrid",
    "dijit/layout/ContentPane",
    "dgrid/extensions/DijitRegistry",
    "dojo/request",
    "config/config",
    "common/formatter/DateFormatter",
    "dijit/form/DateTextBox",
    "dojo/on",
    "dojo/store/Memory",
    "common/formatter/BeaconFormatter",
    "dijit/form/Button"
    ],
    
    function(declare, Arrays, BeaconStore, DomConstruct, BorderContainer, List, Grid, ContentPane, 
            DijitRegistry, Request, Config, DateFormatter, DateTextBox, on, Memory, BeaconFormatter, Button) {
        return declare([], {
           constructor: function() {
               this.mainContainer = DomConstruct.create("div", {style: {
                   width: "100%",
                   height: "100%"
               }});
               
               var sourcePane = new ContentPane({ style: "width: 100%", content: "Timestamp: <br\> Issued by: <br\> Inserted by: <br\> Raw data: " });
               
               var MixedGrid = declare([Grid, DijitRegistry]);
               
               var beaconListGrid = new MixedGrid({
                   id: 'beacon-list-grid',
                   region: "left",
                   style: {
                       height: "100%"
                   },
                   store: BeaconStore,
                   sort: [ { attribute: "timestamp", descending: true }],
                   query: function(beacon) {
                       return config.ESTCube1_BEACONS.defaultRangeStart < beacon.timestamp && 
                           beacon.timestamp < config.ESTCube1_BEACONS.defaultRangeEnd;
                   },
                   columns: [
                       {
                           label: "Timestamp",
                           field: "timestamp",
                           formatter: DateFormatter
                       },
                       
                       {
                           label: "Received by",
                           field: "issuedBy"
                       },

                       {
                           label: "Inserted by",
                           field: "insertedBy"
                       },
                       {
                           label: "Raw data",
                           field: "value",
                           formatter: BeaconFormatter
                       }
                   ]
               });
               
               var beaconFieldsGrid = new MixedGrid({
                   region: "center",
                   id: "beacon-details-grid",
                   style: { width: "400px", height: "100%" },
                   columns: [
                       {
                           label: "Name",
                           field: "name",
                       },
                       
                       {
                           label: "Value",
                           field: "value"
                       },
                       
                       {
                           label: "Unit",
                           field: "unit"
                       },
                       
                       {
                           label: "Description",
                           field: "description"
                       }
                   ]
               });
               
               beaconListGrid.on(".dgrid-row:click", function(evt) {
                   var row = beaconListGrid.row(evt);
                   
                   Request.post(Config.BEACON.CHECK_URL, {
                       data: {
                           source: row.data.issuedBy,
                           insertedBy: row.data.insertedBy,
                           datetime: row.data.timestamp,
                           data: row.data.value
                       },
                       handleAs: "json"
                   }).then(
                       function(data) {
                           beaconFieldsGrid.refresh();
                           
                           var fields = [];
                           
                           for(key in data) {
                               if(config.ESTCube1_BEACONS.hiddenFields.indexOf(key) == -1) {
                                   fields.push(data[key]);
                               }
                           }
                           
                           beaconFieldsGrid.renderArray(fields);
                           
                           sourcePane.set('content', "Timestamp: " + DateFormatter(row.data.timestamp) + "<br\>Issued by: " + 
                                   row.data.issuedBy +  "<br\>Inserted by: " + row.data.insertedBy + "<br\>Raw data: " 
                                   + BeaconFormatter(row.data.value));
                       },
                       
                       function(error) {
                           console.error(error);
                       }
                   );
               });
               
               var dateboxConstraints = {
                   selector: 'date',
                   datePattern: config.SHORT_DATE_FORMAT  
               }
               
               var rangeStart = new DateTextBox({
                   id: "rangeStart",
                   class: "beaconsViewFilter",
                   value: config.ESTCube1_BEACONS.defaultRangeStart,
                   constraints: dateboxConstraints
               });
               
               var rangeEnd = new DateTextBox({
                   id: "rangeEnd",
                   class: "beaconsViewFilter",
                   value: config.ESTCube1_BEACONS.defaultRangeEnd,
                   constraints: dateboxConstraints
               });
               
               var submitFilter = new Button({
                   class: "beaconsViewFilter",
                   label: "Apply filter"
               });
               
               function SetGridFilter(start, end) {
                   beaconListGrid.set("query", function(beacon) {
                       return start <= beacon.timestamp && beacon.timestamp <= end;
                   });
               }
               
               on(submitFilter, "click", function() {
                   SetGridFilter(rangeStart.value, rangeEnd.value);
               });
               

               var rightPane = new ContentPane({ region: "center" });
               rightPane.addChild(sourcePane);
               rightPane.addChild(new ContentPane({
                   content: beaconFieldsGrid,
                   style: {
                       height: "90%"
                   }
               }));
               
               var leftPane = new ContentPane({ 
                   region: "left", 
                   style: {
                       width: "60%",
                       margin: "0px",
                       padding: "0px"
                   }
               });
               
               leftPane.addChild(rangeStart);
               leftPane.addChild(rangeEnd);
               leftPane.addChild(submitFilter);
               leftPane.addChild(new ContentPane({
                   content: beaconListGrid,
                   style: {
                       height: "95%"
                   }
               }));
               
               this.bc = new BorderContainer({}, this.mainContainer);
               this.bc.addChild(leftPane);
               this.bc.addChild(rightPane);
           },
           
           placeAt: function(container) {
               DomConstruct.place(this.mainContainer, container);
               this.bc.startup();
           }
        });
    }
);