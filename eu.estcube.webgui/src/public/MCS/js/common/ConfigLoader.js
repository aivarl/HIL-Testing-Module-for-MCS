define([
    "config/config"
    ],

    function(config) {

         this.config = config;
         this.noOfLoaded = 0;
         this.totalModules = 0;
         this.callback = null;

         this.load = function(packages, callback) {
             this.callback = callback;

             for (var i in packages) {
                 if (packages[i].isModule == true) {
                     this.totalModules++;
                     this.loadModuleConfig(packages[i]);
                 }
             }
         };

         this.loadModuleConfig = function(module) {

            require([module.name + "/config/config"], dojo.hitch(this, function(moduleConfig) {

                this.recursiveMerge(config, moduleConfig, module.name + "/config/config->");

                this.noOfLoaded++;
                if (this.noOfLoaded == this.totalModules) {
                    this.callback();
                }
             }));
         };

         this.recursiveMerge = function(config, addConfig, path) {

             for (var i in addConfig) {

                 if (config[i] == undefined) {
                     config[i] = addConfig[i];

                 } else if (typeof(config[i]) == "object") {
                     this.recursiveMerge(config[i], addConfig[i], path + i + "->");

                 } else if (typeof(config[i]) == "string") {
                     console.warn("Overwrite for config variable " + i + " ignored. Path in config file " + path + i);
                 }
             }

         }

         this.getConfig2 = function() {
             return this.config;
         }

        return this;
    }
);