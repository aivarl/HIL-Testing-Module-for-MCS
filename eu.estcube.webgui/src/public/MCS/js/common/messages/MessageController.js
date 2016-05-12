define([
    "dojo/topic",
    "dojo/_base/window",
    "dojo/dom-construct",
    "dojo/topic",
    "dojox/widget/Toaster",
    "config/config",
    "./SystemMessage",
    ],

    function(Topic, Window, DomConstruct, Topic, Toaster, Config, SystemMessage) {

        var MAP_LOG_LEVEL_TO_MESSAGE = {
            "TRACE":    {},
            "DEBUG":    {},
            "INFO":     { type: "message", duration: 3000 },
            "WARN":     { type: "warning", duration: -1 },
            "ERROR":    { type: "error", duration: -1 },
            "FATAL":    { type: "fatal", duration: -1 },
        };

        var MAP_CHANNEL_EVENT_TO_LEVEL = {
            "Connected": "INFO",
            "Closed": "WARN",
            "Error": "ERROR",
            "Default": "DEBUG",
        };

        var div = DomConstruct.create("div", { id: "notifications" }, Window.body(), "last");
        
        // four toasters for four different types
        // order is important! toasters are overlapped in the order they declared
        // this order reflects order of severity
        // positionDirection is one of ["br-up", "br-left", "bl-up", "bl-right", "tr-down", "tr-left", "tl-down", "tl-right"]
        var toasterMsg   = new Toaster({ id: "notifications-display-msg",   positionDirection: "br-left" }, div);
        var toasterWarn  = new Toaster({ id: "notifications-display-warn",  positionDirection: "br-left" }, div);
        var toasterError = new Toaster({ id: "notifications-display-error", positionDirection: "br-left" }, div);
        var toasterFatal = new Toaster({ id: "notifications-display-fatal", positionDirection: "br-left" }, div);
        
        var MAP_TYPE_TO_TOASTER = {
            "message":  toasterMsg,
            "warning":  toasterWarn,
            "error":    toasterError,
            "fatal":    toasterFatal,
        };

        Topic.subscribe(Config.TOPIC_SYSTEM_MESSAGES, function(message) {
            var conf = MAP_LOG_LEVEL_TO_MESSAGE[message.level];
            if (conf && conf.type) {
                var toaster = MAP_TYPE_TO_TOASTER[conf.type];
                if (conf.duration) {
                    toaster.setContent(message.value, conf.type, conf.duration);
                } else {
                    toaster.setContent(message.value, conf.type);
                }
            }
        });

        Topic.subscribe(Config.TOPIC_CHANNEL_EVENT, function(message) {
            var level = MAP_CHANNEL_EVENT_TO_LEVEL[message.eventType];
            if (!level) {
                level = MAP_CHANNEL_EVENT_TO_LEVEL["Default"];
            }
            var value = "Channel " +  message.channel + " " + message.eventType;
            if (message.error) {
                value = value + " " + message.error;
            }

            Topic.publish(Config.TOPIC_SYSTEM_MESSAGES, new SystemMessage({ level: level, value: value }));
        });

        return this;
    }
);
