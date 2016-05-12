var _siteRoot = "/MCS/";
var packages = [

    // dependencies
    { name: "dgrid",                    location: "/scripts/dgrid-0.3.9" },
    { name: "put-selector",             location: "/scripts/put-selector-0.3.2" },
    { name: "xstyle",                   location: "/scripts/xstyle-0.0.5" },
    { name: "ThreeJS",                  location: "/scripts/threejs-r58" },

    // common packages
    { name: "config",                   location: _siteRoot + "config" },
    { name: "common",                   location: _siteRoot + "js/common" },

    // System packages
    { name: "SystemComponents",         location: _siteRoot + "js/system/components", isModule: true },
    { name: "SystemLog",                location: _siteRoot + "js/system/log", isModule: true },
    { name: "Logout",                   location: _siteRoot + "js/system/logout", isModule: true },
    { name: "Dashboard",                location: _siteRoot + "js/system/dashboard", isModule: true },
    { name: "Demo",                     location: _siteRoot + "js/system/demo", isModule: true },
    { name: "Diagnostics",              location: _siteRoot + "js/system/diagnostics", isModule: true },
    { name: "Messages",                 location: _siteRoot + "js/system/messages", isModule: true },
    { name: "Debug",                    location: _siteRoot + "js/system/debug", isModule: true },
    { name: "Settings",                 location: _siteRoot + "js/system/settings", isModule: true },
    { name: "Query",                    location: _siteRoot + "js/system/query", isModule: true },
    
    // ESTCube-1 packages
    { name: "ESTCube-1.tle",            location: _siteRoot + "js/satellite/ESTCube-1/tle", isModule: true },
    { name: "ESTCube-1.beacon",         location: _siteRoot + "js/satellite/ESTCube-1/beacon", isModule: true },
    { name: "ESTCube-1.commanding",     location: _siteRoot + "js/satellite/ESTCube-1/commanding", isModule: true },
    { name: "ESTCube-1.telemetry",      location: _siteRoot + "js/satellite/ESTCube-1/telemetry", isModule: true },
    { name: "ESTCube-1.beacons",        location: _siteRoot + "js/satellite/ESTCube-1/beacons", isModule: true},
    { name: "ESTCube-1.addbeacons",		location: _siteRoot + "js/satellite/ESTCube-1/addbeacons", isModule: true },
    { name: "ESTCube-1.dashboard",	    location: _siteRoot + "js/satellite/ESTCube-1/dashboard", isModule: true },
    { name: "ESTCube-1.subsys.eps",	    location: _siteRoot + "js/satellite/ESTCube-1/subSystems/eps", isModule: true },

    // GroundStation packages
    { name: "GSDashboard",           	location: _siteRoot + "js/groundstation/dashboard", isModule: true },
    { name: "GSContacts",            	location: _siteRoot + "js/groundstation/contacts", isModule: true },
    { name: "GSAntenna",             	location: _siteRoot + "js/groundstation/antenna", isModule: true },
    { name: "GSTnc",                 	location: _siteRoot + "js/groundstation/tnc", isModule: true },
    { name: "GSWebCam",              	location: _siteRoot + "js/groundstation/webcam", isModule: true },
    { name: "GSWeather",             	location: _siteRoot + "js/groundstation/weather", isModule: true },

    // Contacts packages
    { name: "Map",                      location: _siteRoot + "js/contacts/map", isModule: true},
    { name: "SkyAtGlance",              location: _siteRoot + "js/contacts/skyatglance", isModule: true },
    { name: "ContactPlanning",          location: _siteRoot + "js/contacts/contactplanning", isModule: true },

    // Hidden packages
    { name: "Contactinfo",   			location: _siteRoot + "js/pages/contactinfo", isModule: true },

];
