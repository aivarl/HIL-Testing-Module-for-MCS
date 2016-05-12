define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/request",
    "dojo/cookie",
    "dojo/dom-construct",
    "dijit/Menu",
    "dijit/Toolbar",
    "dijit/DropDownMenu",
    "dijit/form/DropDownButton",
    "dijit/form/Button",
    "dijit/MenuItem",
    "dijit/RadioMenuItem",
    "dijit/MenuSeparator",
    "dijit/PopupMenuItem",
    "dijit/layout/BorderContainer",
    "dijit/form/VerticalSlider",
    "dijit/TooltipDialog",
    "dijit/popup",
    "dijit/form/CheckBox",
    "common/Router",
    "common/TimeFactory",
    "common/formatter/TimeDiffFormatter",
    "common/formatter/DateTimeFormatterNoMS",
    "common/store/MissionInformationStore",
    "common/store/ForEachStoreElement", 
    "common/store/GetUserInformation",
    "common/utils/DoIntersect",
    "common/sound/SoundControlButton",
    "config/config",
    ],

    /**
     * Builds menu based on data in store.
     * Listen changes in store and adjust menu accordingly.
     *
     * TODO "priority" property is not used on sub menu building
     */
    function(declare, Arrays, Lang, on, Request, Cookie, DomConstruct, Menu, Toolbar, 
             DropDownMenu, DropDownButton, Button, MenuItem, RadioMenuItem, MenuSeparator, PopupMenuItem, 
             BorderContainer, VerticalSlider, TooltipDialog, Popup, CheckBox, Router, 
             TimeFactory, TimeDiffFormatter, DateTimeFormatterNoMS, MissionInformationStore, ForEachStoreElement,
             GetUserInformation, CanSee, Config) {

		var pathToPage;
		var pageInMenu;
	
        function getTooltip(item) {
            return item.tooltip == null ? item.label : item.tooltip;
        }

        function bind(node, url) {
            on(node, "click", function() {
                if (url !== undefined) {
                    document.location.href = Router.getUrl(url);
                }
            });
        }

        function createButton(item) {

            if (item.id == "soundMixer"){
                return new SoundControlButton({
                    id : item.id, 
                    tooltip : item.tooltip
                });
            } else {
                return new Button({
                    label: item.label,
                    showLabel: true,
                    iconClass: item.iconClass,
                    title: getTooltip(item),
                    menuId: item.id,
                    url: item.url
                });
            }
        }

        function createDropDownMenu(item) {
            var menu = new DropDownMenu();
            var button = new DropDownButton({
                label: item.label,
                title: getTooltip(item),
                menuId: item.id,
                dropDown: menu
            });
            return button;
        }

        function createMenuItem(item) {
            return new MenuItem({
                label: item.label,
                title: getTooltip(item),
                menuId: item.id,
            });
        }

        function createRadioMenuItem(item, checked) {
            return new RadioMenuItem({
                label: item.label,
                title: getTooltip(item),
                menuId: item.id,
                group: item.parentId,
                checked: checked,
                onClick: function(){
                	var prevCookie = Cookie(item.parentId);
                	Cookie(item.parentId, item.elementId, {expires: 3650});
                	if (prevCookie != item.elementId){
	                	// to reload all the pages
	                	window.location.reload();
                	}
				}
            });
        }

        function createPopupMenuItem(item) {
            var menu = new DropDownMenu();
            var popup = new PopupMenuItem({
                label: item.label,
                title: getTooltip(item),
                menuId: item.id,
                popup: menu,
            });
            return popup;
        }

        function remove(parent, child) {
            var index = parent.getIndexOfChild(child);
            parent.removeChild(child);
            child.destroyRecursive(false);
            return index;
        }

        function findWidget(parent, childId) {
            var result;
            Arrays.forEach(parent.getChildren(), function(child, index) {
                if (child.menuId === childId) {
                    result = child;
                }
            });
            return result;
        }

        function buildMenuBar(container, store, item, userRoles, objectsCreated) {
            if (!objectsCreated[item.id]) {
                objectsCreated[item.id] = true;
                var button = createButton(item);
                bind(button, item.url);
                container.addChild(button);
            }

            store.query(function(obj) {
                return obj.parentId == item.id && CanSee(userRoles, obj.roles);
            }, {sort: [{attribute: "priority", descending: false}]})
            .forEach(function(child, removedFrom, insertedInto) {
                var widget = findWidget(container, item.id);
                
                if (!objectsCreated[child.id]) {
                    if (typeof(widget.addChild) != "function") {
                        var index = remove(container, widget);
                        widget = createDropDownMenu(item);        // TODO add BorderContainer's layoutPriority to buttons ?
                        container.addChild(widget);
                    }
                }

                buildMenuItem(widget.dropDown, store, child, userRoles, objectsCreated);
            });
        }

        function buildMenuItem(parent, store, item, userRoles, objectsCreated) {

            if (!objectsCreated[item.id]) {
                objectsCreated[item.id] = true;
                if (item.missionInformationSelector){
                    var pSubMenu = new Menu();
                    var selectedElementID = Cookie(item.id);
                    var first = true;
                    var selectFirst = selectedElementID == undefined;
                	ForEachStoreElement(MissionInformationStore.query({ class: item.selectableClass }), Lang.hitch(this, function(element) {
                		var subItem = { id: item.id + "/" + element.ID, priority: 1, parentId: item.id, label: element.name, roles: item.roles, elementId: element.ID };
                		var isSelected = selectedElementID == element.ID;
                		if (selectFirst && first) {
                			Cookie(item.id, element.ID, {expires: 3650});
                			first = false;
                			isSelected = true;
                		}
                		var menuItem = createRadioMenuItem(subItem, isSelected); 
                        //bind(menuItem, item.subContent[i].url);
                        pSubMenu.addChild(menuItem);
                    }));
                    parent.addChild(new PopupMenuItem({
                        label: item.label,
                        popup: pSubMenu,
                    }));
                } else if (item.submenu) {
                    var pSubMenu = new Menu();
                    for(var i =0;i<item.subContent.length;i++){
                       var menuItem = createMenuItem(item.subContent[i]);  
                       bind(menuItem, item.subContent[i].url);
                       if (Router.getPath(item.subContent[i].url) == pathToPage) {
                       		pageInMenu = true;
                       }
                       pSubMenu.addChild(menuItem);                           
                    }
                    parent.addChild(new PopupMenuItem({
                           label: item.label,
                           popup: pSubMenu,
                       }));
                } else if (item.label == "separator") {
                    parent.addChild(new MenuSeparator());
                } else {
                    var menuItem = createMenuItem(item);
                    bind(menuItem, item.url);
                    if (Router.getPath(item.url) == pathToPage) {
                    	pageInMenu = true;
                    }
                    parent.addChild(menuItem); // FIXME - 04.03.2013, kimmell - not working
                }
            }

            store.query(function(obj) {
                return obj.parentId == item.id && CanSee(userRoles, obj.roles)
            }, {sort: [{attribute:"priority", descending:false}]})
            .forEach(function(child, removedFrom, insertedInto) {

                if (!objectsCreated[child.id]) {
                    objectsCreated[child.id] = true;
                    var widget = findWidget(parent, item.id);
                    if (!widget.popup) {
                        var index = remove(parent, widget);
                        widget = createPopupMenuItem(item);
                        parent.addChild(widget);
                    }
                }

                buildMenuItem(widget.popup, store, child, userRoles, objectsCreated);
            });
        }

        var aosLosIndicator;
        var clockIndicator;
        var userIndicator;
        var satelliteLabel;
        var groundStationLabel;

        function storeIndicatorReferences( parentContainer ) {
            Arrays.forEach( parentContainer.getChildren(), function(item) {
            	if( item.menuId == "satelliteLabel" ) {
                    satelliteLabel = item;
                } else if( item.menuId == "groundStationLabel" ) {
                    groundStationLabel = item;
                } else if( item.menuId == "aosLosTimer" ) {
                    aosLosIndicator = item;
                } else if( item.menuId == "clock" ) {
                    clockIndicator = item;
                } else if( item.menuId == "user" ) {
                    userIndicator = item;
                } else if( typeof(item.getChildren) == 'function' ) {
                    storeIndicatorReferences( item );
                }
            });
        }

        return declare([], {

                // NB! Will be called two times, must not create the same widget twice
	        	createMenuItems: function(roles, leftToolbar, centerToolbar, rightToolbar, objectsCreated) {                    
                    CreateMenu = Lang.hitch(this, function(items, toolbar) {
                        this.store.query(Lang.hitch(this, function(item) {
                            return Arrays.indexOf(items, item.id) > -1 && CanSee(roles, item.roles)// if item.id is in leftItems, get it from store
                        }), {sort: [{attribute: "priority", descending: false}]} )
                        .forEach(Lang.hitch(this, function(item) {
                            // TODO: Pass the roles parameter here
                            buildMenuBar(toolbar, this.store, item, roles, objectsCreated);
                        }));
                    });

                    CreateMenu(this.leftItems, leftToolbar);
                    CreateMenu(this.centerItems, centerToolbar);
                    CreateMenu(this.rightItems, rightToolbar);
                },

                constructor: function(args) {
                    declare.safeMixin(this, args);

                    // Create main container
                    var mainContainer = new BorderContainer( {gutters:false, style: "width: 100%; height: 100%"} );
                	mainContainer.placeAt(this.parentDivId);
                	
                    // Create left, centre and right subcontainers
                    var leftContainer = new BorderContainer({    region: "left",
                                                                gutters: false,
                                                                style: "width: 30%"
                                                            });
                    var centerContainer = new BorderContainer({    region: "center",
                                                                gutters: false,
                                                                style: "text-align:center"
                                                            });
                    var rightContainer = new BorderContainer({    region: "right",
                                                                gutters: false,
                                                                style: "width: 30%; text-align:right"
                                                            });
                    mainContainer.addChild(leftContainer);
                    mainContainer.addChild(centerContainer);
                    mainContainer.addChild(rightContainer);

                    // Create toolbars for each subcontainer
                    var leftToolbar = new Toolbar( {region:"center"} );
                    var centerToolbar = new Toolbar( {region:"center"} );
                    var rightToolbar = new Toolbar( {region:"center"} );
                    leftContainer.addChild( leftToolbar );
                    centerContainer.addChild( centerToolbar );
                    rightContainer.addChild( rightToolbar );

                    var createdObjects = {};
                    for (obj in this.store) {
                        createdObjects[obj] = false;
                    }
                    
                    pageInMenu = false;
    	        	pathToPage = location.hash.substr(1) || Router.getPath(this.config.DEFAULT_MODULE);
                    
                    this.createMenuItems(config.ROLES_DEFAULT, leftToolbar, centerToolbar, rightToolbar, createdObjects);
                    
                    if (!pageInMenu) {
                    	dojo.byId(this.parentDivId).style.display = 'none';
                    	dojo.byId(this.contentDivId).style.top = '0';
                    }
                    // store reference to aos/los and clock indicators
                    storeIndicatorReferences( mainContainer );

                    // Add TimeFactory listener
                    aosLosIndicator.set( "style", aosLosIndicator.style + "; font-weight: bold" );

                    var counter = Number.MAX_VALUE;
                    TimeFactory.addListener (['aosLosInterval'], this, function( eventName, eventTime ) {

                        if (eventTime >= 0) {
                            var eventTimeS = Math.round(eventTime/1000.0);
                            var formatterStartTime = new Date(0).getTime();

                            // Color the label according to events and time remaining
                            if ( (eventName == "AOS" &&
                                    ((eventTimeS <= Config.MENU_AOS_WARN_TIME && eventTimeS > Config.MENU_AOS_BLINK_TIME) ||
                                    (eventTimeS <= Config.MENU_AOS_BLINK_TIME && eventTimeS % 2 == 0))
                                ) ||
                                (eventName == "LOS" &&
                                    ((eventTimeS <= Config.MENU_LOS_WARN_TIME && eventTimeS > Config.MENU_LOS_BLINK_TIME) ||
                                    (eventTimeS <= Config.MENU_LOS_BLINK_TIME && eventTimeS % 2 == 0))
                                )){
                                aosLosIndicator.set( "label", "<font color=red>" + eventName + " " +
                                                        TimeDiffFormatter(formatterStartTime, eventTime) + "</font>");
                            } else if (eventName == "LOS") {
                                aosLosIndicator.set( "label", "<font color=green>" + eventName + " " +
                                                        TimeDiffFormatter(formatterStartTime, eventTime) + "</font>");
                            } else {
                                aosLosIndicator.set( "label", "" + eventName + " " +
                                                        TimeDiffFormatter(formatterStartTime, eventTime) );
                            }

                        } else {
                            aosLosIndicator.set( "label", "<font color=grey>-- NO AOS/LOS DATA --</font>" );
                        }
                    });

                    TimeFactory.addListener (['clock'], this, function( eventName, eventTime ) {
                        clockIndicator.set( "label", " " + DateTimeFormatterNoMS(eventTime) );
                    });

         //------------------------------------------------------------------------------------------------------------------------------------------   

                    userIndicator.set("label", "User: unknown");
                    GetUserInformation(Lang.hitch(this, function(userInfo) {
                        userIndicator.set( "label", "User: " + userInfo.username );
                        this.createMenuItems(userInfo.roles, leftToolbar, centerToolbar, rightToolbar, createdObjects);
                    }));

                    satelliteLabel.set("style",satelliteLabel.style + "; font-weight: bold" );
                    groundStationLabel.set("style",groundStationLabel.style + "; font-weight: bold" );
                    var gsName = MissionInformationStore.getGroundStation().name;
                    groundStationLabel.set("label", gsName);

         //------------------------------------------------------------------------------------------------------------------------------------------ 
            // Lay out the menubar
                    mainContainer.startup();
                }

        });
    }
);
