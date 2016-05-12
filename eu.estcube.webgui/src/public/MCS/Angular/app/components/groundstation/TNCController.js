/**
 * Controller for checking system components.
 */
// Add controller to module.
angular
    .module('MCS')
    .controller('TNCController', TNCController);


function TNCController(SYSCOMPONENTS, CONFIG, httpService, $scope, $websocket, $location, $indexedDB, webStorage) {

    var vm = this;

    var satData = httpService.getSatellites();
    var gsData = httpService.getGroundStations();

    $scope.TNCactive = false;

    // Table sorting variables.
    $scope.orderByField = 'timestamp';
    $scope.reverseSort = true;

    // Formatting timestamp.
    vm.dateFormat = CONFIG.DEFAULT_DATE_FORMAT;

    // Get data from Web Storage if available, so I wouldn't have to load cache
    // from server(websocket) every time I return to the page.
    vm.AX25UIFrames = webStorage.session.get("ax25frames");
    if (!vm.AX25UIFrames) {
        vm.AX25UIFrames = [];
    }

    var webSocketObject;

    // Transport web socket url.
    var addr = "ws://" + $location.host() + ":" + CONFIG.WEB_SOCKET_PORT + CONFIG.WEBSOCKET_TRANSPORT;

    console.log("addr: " + addr);
    var ws = $websocket.$new(addr); // instance of ngWebsocket, handled by $websocket service

    ws.$on('$open', function() {
        // Clear storage, loading cache from server(websocket).
        vm.AX25UIFrames = [];
        webStorage.session.remove("ax25frames");

        console.log('[TNCController] Websocket open ' + addr);
        console.log('[TNCController] Sending cache request through websocket: ' + addr);
        ws.$emit('cache');
    });

    ws.$on('$message', function(data) {
        webSocketObject = JSON.parse(data);


        // if(data.headers.type === "AX.25" && (typeof data.frame.srcAddr == "undefined"
        // || typeof data.frame.destAddr == "undefined")) {
        // console.log("Invalid AX.25 frame received. Possible cause: partial TNC
        // frame.");
        // // Topic.publish(Config.TOPIC_SYSTEM_MESSAGES, new SystemMessage({
        // // value: "Invalid AX.25 frame received. Possible cause: partial TNC frame.",
        // // level: "WARN"
        // // }));
        // }
        if (webSocketObject.headers.class == "Ax25UIFrame") {

            // TODO Add these together, use $q.
            satData.then(function(response) {
                var satData = response.data;
                for (sat of satData) {
                    if (webSocketObject.headers.satelliteId == sat.ID) {
                        webSocketObject.headers.satelliteId = sat.name;
                    } else {
                        webSocketObject.headers.satelliteId = "...";
                    }
                }
            })
            gsData.then(function(response) {
                var gsData = response.data;
                for (gs of gsData) {
                    if (webSocketObject.headers.groundStationId == gs.ID) {
                        webSocketObject.headers.groundStationId = gs.name;
                    }
                }
            })

            vm.AX25UIFrames.push(webSocketObject);

            // Add frames to session storage.
            webStorage.session.add("ax25frames", vm.AX25UIFrames);
        } else {
            console.log("websocketobject");
            console.log(webSocketObject);

        }

        // Update view.
        $scope.$apply();

    });

    ws.$on('$close', function() {
        console.log('[TNCController] Websocket closed ' + addr);
    });

}