define([
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/_base/array",
        "dojo/aspect", 
        "dojo/dom-class", 
        "dojox/grid/EnhancedGrid",
        "dojox/grid/enhanced/plugins/Pagination",
        "dojox/grid/enhanced/plugins/exporter/CSVWriter",
        "dgrid/util/misc", 
        "./ContentProvider",
        "common/store/ArchiverStore",  
        "dojo/data/ObjectStore",
        ],
        function(declare, Lang, Arrays, Aspect, DomClass, EnhancedGrid, 
        		Pagination, CSVWriter, Misc, ContentProvider, ArchiverStore, ObjectStore) {
            return declare(ContentProvider, {
            	
                grid : null,
                store : new ObjectStore({objectStore: ArchiverStore }),
                query: { class: "row" },
                getContent: function (args) {

                    declare.safeMixin(this, args);
                    queryGrid = new EnhancedGrid({
                        class: "grid",
                        id: "Enhanced-grid-query",
                        rowSelector: '20px',
                        structure: this.structure || [{label : "ID", field : "id",}],
                        store: this.store, 
                        //query: this.query,
                        selectionMode: "single",
                        plugins: {
                            pagination: {
                                pageSizes: ["10", "50", "100", "150", "200"],
                                defaultPageSize: "50",
                                description: true,
                                sizeSwitch: true,
                                pageStepper: true,
                                gotoButton: true,
                                        /*page step to be displayed*/
                                maxPageStep: 6,
                                        /*position of the pagination bar*/
                                position: "top"
                            },
                            exporter: true
                          }
                        
                    }, document.createElement('div')),

                    setTimeout(function () {
                        queryGrid.set("showHeader", true);
                        queryGrid.canSort(true);
                        queryGrid.sortInfo = -2;
                    }, 500);

                    return queryGrid;
                },

                startup: function() {
                    this.grid.startup();
                },  
            });
        });
