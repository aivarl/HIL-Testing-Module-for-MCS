define([
    "dojo/_base/declare",
    "dojo/_base/array",
    "dojo/_base/lang",
    "config/config",
    "common/Controller",
    "./CommandingView",
    "./ParametersView",
    ],

    function(declare, Arrays, Lang, Config, Controller, CommandingView, ParametersView ) {
        var s = declare([Controller], {

            constructor: function() {
            	  this.view = new CommandingView(); 
                  this.parametersView = new ParametersView(); 
            },

            index: function(params) {
                this.placeWidget(this.view);
                this.placeWidget(this.parametersView);
            },

 
        });
        return new s();
    }
);
