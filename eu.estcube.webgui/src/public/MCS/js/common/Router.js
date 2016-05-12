var __ROUTER_GLOBAL;
define([
    "dojo/dom",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/router",
    "common/store/GetUserInformation",
    "common/utils/DoIntersect",
    "dojo/domReady!"
    ],

    function(dom, Lang, Arrays, router, GetUserInformation, CanSee) {

        this.routes = null;
        this.previousModule = null;
        this.previousModulePath = null;
        this.previousModuleDestroyMethod = undefined;

        __ROUTER_GLOBAL = this;

        this.init = function(config, container) {
            this.config = config;
            this.routes = config.routes;
            this.container = container;
            
            this.userRoles = config.ROLES_DEFAULT;

            for (var i in this.routes) {
                if(typeof(this.routes[i].roles) == "undefined") {
                    // If nothing is declared, the view is accessible to anyone
                    this.routes[i].roles = config.ROLES_ALL;
                }
                
                routeBuilder(this.routes[i]);
            }
            
            GetUserInformation(Lang.hitch(this, function(userInfo) {
                this.userRoles = userInfo.roles;
            }));
            
            router.startup();
        }

        /**
         * Build route from route config item
         */
        this.routeBuilder = function(item, parent) {

            // set child route defaults.
            if (parent) {
                item.path = parent.path + item.path;
                if (item.defaults == undefined) {
                    item.defaults = {};
                }
                for (var i in parent.defaults) {
                    if (!item.defaults[i]) {
                        item.defaults[i] = parent.defaults[i];
                    }
                }
            }

            // register route
            router.register(item.path, function(evt) {
                if(CanSee(userRoles, item.roles)) {
                    loadControllerMethod(item, evt);
                } else {
                    alert('You do not have access to this page');
                    console.error('[Router] Restricted page requested: ', item.path);
                }
            });

            // iterate through child routes.
            if (item.childRoutes) {
                for (var i in item.childRoutes) {
                    routeBuilder(item.childRoutes[i], item);
                }
            }
        };

        /**
         * Load new view.
         */
        this.loadControllerMethod = function(route, evt) {

            require.on("error", function(error) {
                console.log(error.src, error.id);
            });

            require([route.defaults.controller], function(module) {

                if (previousModule) {
                    if (previousModuleDestroyMethod != undefined) {
                        previousModule[previousModuleDestroyMethod]();
                        console.log("[Router] Invoke " + previousModulePath + "::" + previousModuleDestroyMethod);
                    }

                    if (previousModule.destroy) {
                        previousModule.destroy();
                        console.log("[Router] Invoke " + previousModulePath + "::destroy");
                    }
                }

                if (!module.init) {
                    console.error("[Router]Module " + route.defaults.controller + " does not have 'init' method. Did you forget to extend Controller?");
                    return;
                }
                module.init(config, this.container);

                previousModule = module;
                previousModulePath = route.defaults.controller;
                previousModuleDestroyMethod = route.defaults.destroyMethod;

                if (module && module.setup) {
                    console.log("[Router] Invoke " + route.defaults.controller + "::setup");
                    module.setup();
                }

                console.log("[Router] Invoke " + route.defaults.controller + "::" + route.defaults.method);

                module[route.defaults.method](evt.params);
            });
        };

        this.getPathJs = function(route, params) {
            return "javascript: __ROUTER_GLOBAL.toRouteByPath('" + this.getPath(route, params) + "')";
        }

        this.toRoute = function(route, params) {
            this.toRouteByPath(this.getPath(route, params));
        };

        this.toRouteByPath = function(path) {
            router.go(path);
        }

        this.getUrl = function(route, params) {
            return "#" + this.getPath(route, params);
        }

        this.getPath = function(route, params) {

            var path = this.routeBuilderHelper(route.split("/"), this.routes, route);
            for (var i in params) {
                path = path.replace(":" + i, params[i]);
            }
            return path;
        };

        this.goToCurrent = function() {
            var path = location.hash.substr(1) || this.getPath(this.config.DEFAULT_MODULE);
            router.go(path);
        };

        this.routeBuilderHelper = function(route, routes, fullRoute) {
            if (route == "") {
                return "";
            }

            var current = route.shift();
            if (!routes[current]) {
                console.warn("[Router] Route '" + fullRoute + "' not found!");
                return "";
            }

            if (route.length > 0 && routes[current].childRoutes) {
                return this.routeBuilderHelper(route, routes[current].childRoutes, fullRoute);
            } else {
                return routes[current].path;
            }

            return "";
        }

        return this;
    }
);
