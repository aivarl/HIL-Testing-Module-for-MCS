define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/topic",
    "config/config",
    "common/messages/SystemMessage",
    ],

    function(declare, Lang, Aspect, Topic, Config, SystemMessage) {
        return declare([], {

            store: null,
            storeName: null,
            storeSize: 0,

            constructor: function(args) {
                declare.safeMixin(this, args);
                Aspect.before(this.store, "put", Lang.hitch(this, this.beforePut));
                Aspect.after(this.store, "put", Lang.hitch(this, this.afterPut));
                Aspect.after(this.store, "remove", Lang.hitch(this, this.afterRemove));
                var message = new SystemMessage({ value: this.storeName + " ready", level: "DEBUG" });
                Topic.publish(Config.TOPIC_SYSTEM_MESSAGES, message);
            },

            beforePut: function() {
                this.storeSize = this.store.data.length;
            },

            afterPut: function() {
                var newSize = this.store.data.length;
                var type = this.storeSize == newSize ? "update" : "add";
                Topic.publish(Config.TOPIC_STORE_EVENT, { storeName: this.storeName, eventType: type, storeSize: newSize });
            },

            afterRemove: function() {
                var newSize = this.store.data.length;
                Topic.publish(Config.TOPIC_STORE_EVENT, { storeName: this.storeName, eventType: "remove", storeSize: newSize });
            },

        });

    }
);
