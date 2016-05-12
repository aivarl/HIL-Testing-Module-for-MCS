/**
 * Configuration.
 */
// Add constant to module.
angular
    .module('MCS')
    .constant("CONFIG", {
        SERVICE_ID:                         "eu.estcube.webgui",
        MENU_STRUCTURE_CONFIG_MODULE:       "config/menu",
        DEFAULT_MODULE:                     "ESTCube1_DASHBOARD",
        LOGOUT_PATH:                        "/logout",

        // Configure the browser window/tab title in init.js

        DEFAULT_DATE_FORMAT:                "yyyy-MM-dd HH:mm:ss.sss", // "yyyy-MM-dd (DDD) HH:mm:ss.SSS"
        DEFAULT_DATE_FORMAT_NO_MS:          "yyyy-MM-dd HH:mm:ss",
        SHORT_TIME_FORMAT:                  "HH:mm:ss",
        SHORTER_TIME_FORMAT:                "HH:mm",
        SHORT_DATE_FORMAT:                  "yyyy-MM-dd",


        // Menubar AOS/LOS counter event times
        MENU_AOS_WARN_TIME:                 600,    // seconds, if smaller than MENU_AOS_BLINK_TIME, steady color is disabled
        MENU_AOS_BLINK_TIME:                60,     // seconds, set to 0 to disable
        MENU_LOS_WARN_TIME:                 120,    // seconds, if smaller than MENU_LOS_BLINK_TIME, steady color is disabled
        MENU_LOS_BLINK_TIME:                60,     // seconds, set to 0 to disable

        EXPIRATION_DATE:                    "365",

        WEB_SOCKET_PORT:                    "1337",

        TOPIC_CHANNEL_REQUEST:              "/channel/request",
        TOPIC_CHANNEL_EVENT:                "/channel/event",
        TOPIC_CHANNEL_SEND_MESSAGE:         "/channel/message",

        TOPIC_SELECTION_PARAMETER:          "/selection/parameter",
        TOPIC_SELECTION_COMMAND:            "/selection/command",

        TOPIC_PARAMETER_SHOW:               "/parameter/show",
        TOPIC_PARAMETER_HIDE:               "/parameter/hide",

        TOPIC_STORE_EVENT:                  "/store/event",

        TOPIC_SYSTEM_MESSAGES:              "/system/message",

        TOPIC_SCRIPT:                       "/script/request",

        TOPIC_SCRIPT_SUBMIT:                "/script/submit",

        URL_CATALOGUE_SATELLITES:           "/catalogue/satellites",
        URL_CATALOGUE_GROUND_STATIONS:      "/catalogue/groundstations/",
        URL_CATALOGUE_ORBITAL_STATES:       "/catalogue/orbitalstates/",
        URL_CATALOGUE_CONTACTS:             "/catalogue/contactevents/",
        URL_CATALOGUE_BEACONS:              "/beacons",

        DND_TYPE_PARAMETER:                 "/dnd/type/parameter",
        DND_TYPE_COMMAND:                   "/dnd/type/command",

        WEBSOCKET_ALL:                      "/hbird.out.all",
        WEBSOCKET_BINARY:                   "/hbird.out.binary",
        WEBSOCKET_BUSINESS_CARDS:           "/hbird.out.businesscards",
        WEBSOCKET_PARAMETERS:               "/hbird.out.parameters",
        WEBSOCKET_PARAMETER_LEVELS:         "/hbird.out.parameters.levels",
        WEBSOCKET_SYSTEM_LOG:               "/hbird.out.systemlog",
        WEBSOCKET_SCRIPTOUTPUT:             "/hbird.out.script.output",
        WEBSOCKET_ORBITAL_PREDICTIONS:      "/orbital.predictions",
        WEBSOCKET_SYSTEM_MESSAGES:          "/hbird.out.events",
        WEBSOCKET_TRANSPORT:                "/estcube.out.transport",
        WEBSOCKET_ARCHIVE:                  "/estcube.out.archive",

        STORE_LIMIT_SYSTEM_LOG:             100,
        STORE_LIMIT_TRANSPORT_FRAMES:       1000,
        STORE_LIMIT_SYSTEM_MESSAGES:        100,

        ORBITAL_STATE_UPDATE_INTERVAL:      1000 * 60 * 10,
        CONTACT_UPDATE_INTERVAL:            1000 * 60 * 10,
        BEACON_UPDATE_INTERVAL:             1000 * 60 * 10,

        TRANSPORT_FRAME_FILTER:             ["TncFrame", "Ax25UIFrame"], // Frame classes accepted by TransportFrameStore

        ROLES_ALL:                          ['mcs-op', 'mcs-premium-op'],
        ROLES_DEFAULT:                      ['mcs-op'],
        ROLES_CAN_COMMAND:                  ['mcs-premium-op'],

        VALUE_UNKNOWN:                      "-", // use this string to indicate unknown values in grids, displays etc.

        SOUND_URL_FLASH:                    "./soundmanager/swf",
        SOUND_URL_STREAM:                   "", //left empty so it wouldn't silently stream in the background "http://ice.somafm.com/missioncontrol" - http://ut-gs.physic.ut.ee:8000/sat.ogg - REPLACE WHEN STREAM IS FIXED
        SOUND_URL_AOS:                      "./soundmanager/AOS.mp3",
        SOUND_URL_AOSINONE:                 "./soundmanager/AOSinOne.mp3",
        SOUND_URL_AOSINFIVE:                "./soundmanager/AOSinFive.mp3",
        SOUND_URL_LOS:                      "./soundmanager/LOS.mp3",
        SOUND_URL_LOSINONE:                 "./soundmanager/LOSinOne.mp3",
        SOUND_URL_LOSINFIVE:                "./soundmanager/LOSinFive.mp3",
        SOUND_URL_FRAME:                    "./soundmanager/Frame.mp3",

        SOUND_ID_STREAM:                    "Stream",
        SOUND_ID_AOS:                       "AOS",
        SOUND_ID_AOSINONE:                  "AOSinOne",
        SOUND_ID_AOSINFIVE:                 "AOSinFive",
        SOUND_ID_LOS:                       "LOS",
        SOUND_ID_LOSINONE:                  "LOSinOne",
        SOUND_ID_LOSINFIVE:                 "LOSinFive",
        SOUND_ID_FRAME:                     "Frame",

        COOKIE_STREAM_VOLUME:               "StreamVolume",
        COOKIE_NOTIFICATIONS_VOLUME:        "NotificationsVolume",
        COOKIE_STREAM_MUTE:                 "StreamMute",
        COOKIE_NOTIFICATIONS_MUTE:          "NotificationsMute",

        CLASS_SPEAKER:                      "speaker",
        CLASS_SPEAKER_MUTE:                 "speaker-mute"
    })