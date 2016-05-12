define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/request",
    "dojo/topic",
    "config/config",
    "common/Controller",
    "common/store/TleStore",
    "./TleView",
    ],

    function(declare, Arrays, Lang, Request, Topic, Config, Controller, TleStore, TleView) {
        var s = declare([Controller], {

            constructor: function() {
                this.view = new TleView();
                Topic.subscribe(Config.TLE.TOPIC_TLE_SUBMIT, Lang.hitch(this, this.onTleSubmit));
            },

            index: function(params) {
                this.placeWidget(this.view);
                this.loadData();
            },

            onTleSubmit: function(tle) {
                console.log("Submitting TLE: " + JSON.stringify(tle));
                Request.post(Config.TLE.URL_TLE_SUBMIT, {
                    data: tle,
                    handleAs: "json",
                }).then(
                    Lang.hitch(this, this.onServerSuccess),
                    Lang.hitch(this, this.onServerError)
                );
            },

            onRequestError: function(error) {
                // TODO - 26.02.2013 kimmell - report error
                alert(error);
                console.error("TLE request failed; " + error.message);
            },

            onServerSuccess: function (data) {
                // TODO - 26.02.2013 kimmell - handle server response properly
                if (data.status != "OK") {
                    console.warn("TLE submit failed with server error response " + JSON.stringify(data));
                    alert(data.value);
                } else {
                    console.log("TLE submitted successfully to web server");
                }
            },

            loadData: function() {
                Request.get(Config.TLE.URL_TLE_QUERY, { handleAs: "json" }).then(
                    Lang.hitch(this, this.handleData),
                    Lang.hitch(this, this.onRequestError)
                );
            },

            handleData: function(data) {
                Arrays.forEach(data, function(item, index) {
                    TleStore.handle(item);
                }, this);
            },

        });
        return new s();
    }
);
