require([
    "dojo/dom",
    "dojo/Deferred",
    "common/ConfigLoader",
    "common/Router",
    "dojo/cookie",
    "common/sound/SoundController",
    "dojo/domReady!"
    ],

    function(dom, Deferred, ConfigLoader, router, Cookie) {

        function setupCommunication(num) {
            var deferred = new Deferred();
            require([
                "common/net/WebSocketProxy",
                ],

                function(Proxy) {
                    new Proxy();
                    deferred.resolve({ number: num, message: "Proxy loaded" });
                }
            );
            return deferred.promise;
        }

        function setupDiagnostics(num) {
            var deferred = new Deferred();
            require([
                "common/store/DiagnosticsStore",
                ],

                function(DiagnosticsStore) {
                    deferred.resolve({ number: num, message: "DiagnosticsStore loaded" });
                }
            );
            return deferred.promise;
        }

        function setupMessaging(num) {
            var deferred = new Deferred();
            require([
                "common/messages/MessageController",
                "common/store/SystemMessageStore",
                ],

                function(MessageController, SystemMessageStore) {
                    deferred.resolve({ number: num, message: "Messaging system loaded" });
                }
            );
            return deferred.promise;
        }

        function initRouter(num) {
            router.init(ConfigLoader.getConfig2(), dom.byId("content"));
            router.goToCurrent();
            return { number: num, message: "Router initialized" };
        }

        function setupMenu(num) {
            var deferred = new Deferred();
            require([
                "common/display/MenuBar",
                "common/store/PageStore"
                ],

                function(MenuBar, pageStore) {
                    new MenuBar({
                        store: pageStore,
                        parentDivId: "menu",
                        contentDivId: "content",
                        leftItems: ["system", "ESTCube-1", "groundStations", "contactsMenu"],
                        centerItems: ["groundStationLabel", "satelliteLabel","aosLosTimer", "clock"],
                        rightItems: ["soundMixer", "settings", "user", "logout"]
			    
                    });
                    deferred.resolve({ number: num, message: "Menu loaded" });
                }
            );
            return deferred.promise;
        }

        function setupMib(num) {
            var deferred = new Deferred();
            require([
                "common/store/MissionInformationStore",
                ],

                function(MissionInformationStore) {
                    deferred.resolve({ number: num, message: "MissionInformationStore loaded" });
		}
            );
            return deferred.promise;
        }

        function log(data) {
            console.log("[init] " + data.number + ": " + data.message);
            return data.number + 1;
        }
        
        function initSound(){
            
            var A = new SoundController();
            A.initSound();
            
        }
        
        
        ConfigLoader.load( packages, function() {

            // calling async loaders here synchronously
            // to make sure all components are initialized
            // in rigth order
            setupCommunication(1)       // [init] 1
                .then(log)
                .then(setupDiagnostics) // [init] 2
                .then(log)
                .then(setupMessaging)   // [init] 3
                .then(log)
                .then(initRouter)       // [init] 4
                .then(log)
                .then(setupMib)         // [init] 5
                .then(log)
                .then(setupMenu)        // [init] 6
                .then(log);
        });
        initSound();
        
        // Set window title
        //
        // Parameters contained in userInfo:
        // username, roles, serviceId, serviceVersion, host, port, class
        //
        // Other available parameters:
        // window.location, window.location.host, window.location.hostname, window.location.port
        
        function setTitle( uInfo ) {
            window.document.title = "" + uInfo.serviceId;   // Set the browser window/tab title
        }
        
        require(["common/store/GetUserInformation"], function(GetUserInformation) {
           GetUserInformation(setTitle); 
        });
});
