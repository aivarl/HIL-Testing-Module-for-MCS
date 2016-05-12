define([
    "config/config",
    "dojo/domReady!"
    ],

    function (Config) {

        return [
            // Left, centre and right positioning is done in init.js
            // Priority is applicable within a single container only
            // level 1
            { id: "contactsMenu", parentId: "", priority: 1, label: "Contacts", url: "/MCS", tooltip: "", roles: Config.ROLES_ALL },
            { id: "satellites", parentId: "", priority: 2, label: "Satellites", url: "/MCS", tooltip: "Satellites", roles: Config.ROLES_ALL },
            { id: "groundStations", parentId: "", priority: 3, label: "Ground Stations", url: "/MCS", tooltip: "Ground Stations", roles: Config.ROLES_ALL },
            { id: "system", parentId: "", priority: 4, label: "System", url: "/MCS", tooltip: "", icon: "/images/transmit.png", roles: Config.ROLES_ALL },
            { id: "clock", parentId: "", priority: 5, label: "CLOCK", tooltip: "", roles: Config.ROLES_ALL },
            { id: "groundStationLabel", parentId: "", priority: 6, label: "GS", tooltip: "", roles: Config.ROLES_ALL },
            { id: "satelliteLabel", parentId: "", priority: 7, label: "ESTCube-1", tooltip: "", roles: Config.ROLES_ALL },
            { id: "aosLosTimer", parentId: "", priority: 8, label: "AOSLOS", tooltip: "", roles: Config.ROLES_ALL },
            { id: "soundMixer", parentId: "", priority: 9, label: "", tooltip: "Sound mixer", iconClass: "speaker", roles: Config.ROLES_ALL },
            { id: "user", parentId: "", priority: 10, label: "username", tooltip: "", roles: Config.ROLES_ALL },
            { id: "logout", parentId: "", priority: 11, label: "Logout", url: "LOGOUT", tooltip: "Logout user", roles: Config.ROLES_ALL },

            // level 2: system
            { id: "sysDashboard", parentId: "system", priority: 1, label: "Dashboard", url: "DASHBOARD", tooltip: "System Dashboard", roles: Config.ROLES_ALL },
            { parentId: "system", priority: 2, label: "separator", roles: Config.ROLES_ALL },
            { id: "settings", parentId: "system", priority: 3, label: "Settings", url: "SETTINGS", tooltip: "System Settings", roles: Config.ROLES_ALL },
            { parentId: "system", priority: 4, label: "separator", roles: Config.ROLES_ALL },
            { id: "components", parentId: "system", priority: 5, label: "System Components", url: "SYSTEM_COMPONENTS", tooltip: "Status of system components", roles: Config.ROLES_ALL },
            { id: "log", parentId: "system", priority: 6, label: "System Log", url: "SYSTEM_LOG", tooltip: "System log", roles: Config.ROLES_ALL },
            { id: "messages", parentId: "system", priority: 7, label: "System Messages", url: "MESSAGES", tooltip: "System messages", roles: Config.ROLES_ALL },
            { id: "diagnostics", parentId: "system", priority: 8, label: "UI Diagnostics", url: "DIAGNOSTICS", tooltip: "UI diagnostics", roles: Config.ROLES_ALL },
            { id: "query", parentId: "system", priority: 9, label: "Data Query", url: "QUERY", tooltip: "Query Interface", roles: Config.ROLES_ALL },
            { parentId: "system", priority: 10, label: "separator", roles: Config.ROLES_ALL },
            { id: "debug", parentId: "system", priority: 11, label: "Debug", url: "DEBUG", tooltip: "Debug view", roles: Config.ROLES_ALL },
            
            // level 2: satellites
            { id: "ESTCube-1", parentId: "satellites", priority: 1, label: "ESTCube-1", url: "/ESTCUBE/Satellites/ESTCube-1", tooltip: "Satellite ESTCube-1", roles: Config.ROLES_ALL },
            { id: "ESTCube-1-FS", parentId: "satellites", priority: 2, label: "ESTCube-1-FS", url: "/ESTCUBE/Satellites/ESTCube-1-FS", tooltip: "Satellite ESTCube-1-FS", roles: Config.ROLES_ALL },

            // level 3: ground stations
            { id: "gsSelector", parentId: "groundStations", priority: 1, missionInformationSelector: true, selectableClass: "GroundStation", label: "Choose GS", tooltip: "Select a Ground Station", roles: Config.ROLES_ALL },
            { parentId: "groundStations", priority: 2, label: "separator", roles: Config.ROLES_ALL },
            { id: "gsDashboard", parentId: "groundStations", priority: 3, label: "Dashboard", url: "GS_DASHBOARD", tooltip: "Groundstation Dashboard", roles: Config.ROLES_ALL },
            { id: "TNC", parentId: "groundStations", priority: 4, label: "TNC", url: "GS_TNC", tooltip: "Terminal Node Controller", roles: Config.ROLES_ALL },
            { parentId: "groundStations", priority: 5, label: "separator", roles: Config.ROLES_ALL },
            { id: "webcam", parentId: "groundStations", priority: 6, label: "Webcam", url: "GS_WEBCAM", tooltip: "Web Camera", roles: Config.ROLES_ALL },
            { id: "antenna", parentId: "groundStations", priority: 7, label: "Antenna", url: "GS_ANTENNA", tooltip: "Antenna visualisation", roles: Config.ROLES_ALL },
            { parentId: "groundStations", priority: 8, label: "separator", roles: Config.ROLES_ALL },
            { id: "weather", parentId: "groundStations", priority: 9, label: "Weather", url: "GS_WEATHER", tooltip: "Weather Information", roles: Config.ROLES_ALL },
            { parentId: "groundStations", priority: 10, label: "separator", roles: Config.ROLES_ALL },
            { id: "contacts", parentId: "groundStations", priority: 11, label: "Contacts", url: "GS_CONTACTS", tooltip: "Contacts", roles: Config.ROLES_ALL },
            
            // level 3: satellites -> ESTCube-1
            { id: "ESTCube-1/dashboard", parentId: "ESTCube-1", priority: 1, label: "Dashboard", url: "ESTCube1_DASHBOARD", tooltip: "ESTCube-1 Dashboard", roles: Config.ROLES_ALL },
            { parentId: "ESTCube-1", priority: 2, label: "separator", roles: Config.ROLES_ALL },
            { id: "ESTCube-1/TLE", parentId: "ESTCube-1", priority: 3, label: "TLE", url: "ESTCube1_TLE", tooltip: "Two Line Element Input", roles: Config.ROLES_ALL },
            { parentId: "ESTCube-1", priority: 4, label: "separator", roles: Config.ROLES_ALL },                     
            { id: "subMenu", parentId: "ESTCube-1", priority: 5, submenu: true, label: "Subsystems",tooltip: "'ESTCube-1 Subsystems", roles: Config.ROLES_ALL,
                subContent:[{ id: "ESTCube-1/subSystems/eps",priority: 6, parentId: "Subsystems", label: "EPS", url: "ESTCube1_SUBSYS_EPS", tooltip: "Electrical Power System", roles: Config.ROLES_ALL }]
            },
            { parentId: "ESTCube-1", priority: 7, label: "separator", roles: Config.ROLES_ALL },  
            { id: "ESTCube-1/beacons", parentId: "ESTCube-1", priority: 8, label: "View Beacons", url: "ESTCube1_BEACONS", tooltip: "Received Radio Beacons", roles: Config.ROLES_ALL },
            { id: "ESTCube-1/AddBeacons", parentId: "ESTCube-1", priority: 9, label: "Multi-Beacon Input", url: "ESTCube1_addbeacons", tooltip: "Upload csv radio beacons", roles: Config.ROLES_ALL },
            { id: "ESTCube-1/beacon", parentId: "ESTCube-1", priority: 10, label: "Beacon Input", url: "ESTCube1_Beacon", tooltip: "Radio Beacon Input", roles: Config.ROLES_ALL },

            { parentId: "ESTCube-1", priority: 11, label: "separator", roles: Config.ROLES_ALL },         
            { id: "ESTCube-1/telemetry", parentId: "ESTCube-1", priority: 12, label: "View Telemetry", url: "ESTCube1_TELEMETRY", tooltip: "Satellite Telemetry", roles: Config.ROLES_ALL },
            { id: "ESTCube-1/commanding", parentId: "ESTCube-1", priority: 13, label: "Send Commands", url: "ESTCube1_Commanding", tooltip: "Satellite Commanding", roles: Config.ROLES_CAN_COMMAND },
            { parentId: "ESTCube-1", priority: 14, label: "separator", roles: Config.ROLES_ALL },      

            // level 3: Contacts
            { id: "map", parentId: "contactsMenu", priority: 1, label: "Map", url: "MAP", tooltip: "Map view", roles: Config.ROLES_ALL },
            { parentId: "contactsMenu", priority: 2, label: "separator", roles: Config.ROLES_ALL },
            { id: "skyatglance", parentId: "contactsMenu", priority: 4, label: "Sky At Glance", url: "SKYATGLANCE", tooltip: "Sky at glance", roles: Config.ROLES_ALL },
            { id: "contactplanning", parentId: "contactsMenu", priority: 4, label: "Contact Planning", url: "CONTACTPLANNING", tooltip: "Contact planning", roles: Config.ROLES_ALL },

        ];
    }
);
