/**
 * Controller for checking system components.
 */
// Add controller to module.
angular
    .module('MCS')
    .controller('SystemComponentsController', SystemComponentsController);


function SystemComponentsController(SYSCOMPONENTS, CONFIG, httpService, $scope, $websocket, $location, $indexedDB, webStorage) {
    // TODO Add these 2 functions to a service.
    function getStatus(component, now) {
        var period = parseInt(component.period);
        var diff = getTimeout(component, now);
        return diff <= 0 ? "OK" : (diff > period ? "Error" : "Warning");
    }

    function getTimeout(component, now) {
        var timestamp = parseInt(component.timestamp);
        var period = parseInt(component.period);
        var diff = now - (timestamp + period);
        return diff;
    }

    var vm = this;

    // Table sorting variables.
    $scope.orderByField = 'ID';
    $scope.reverseSort = false;

    // Formatting timestamp.
    vm.dateFormat = CONFIG.DEFAULT_DATE_FORMAT;

    vm.webSocketSet = Object.create(null); // create an object with no properties NOT USED

    // Get data from Web Storage if available, so I wouldn't have to load cache
    // from server(websocket) every time I return to the page.
    vm.businessCards = webStorage.session.get("businessCards");
    if (!vm.businessCards) {
        vm.businessCards = [];
    }

    var webSocketObject;

    // Business cards web socket url.
    var addr = "ws://" + $location.host() + ":" + CONFIG.WEB_SOCKET_PORT + CONFIG.WEBSOCKET_BUSINESS_CARDS;

    console.log("addr: " + addr);
    var ws = $websocket.$new(addr); // instance of ngWebsocket, handled by $websocket service

    ws.$on('$open', function() {
        // Clear storage, loading cache from server(websocket).
        vm.businessCards = [];
        webStorage.session.remove("businessCards");

        console.log('[SystemComponentsController] websocket open ' + addr);
        console.log('[SystemComponentsController] Sending cache request through websocket: ' + addr);
        ws.$emit('cache');
    });

    ws.$on('$message', function(data) {
        webSocketObject = JSON.parse(data);
        var add = true;

        // Add status to component.
        var now = new Date().getTime();
        webSocketObject.status = getStatus(webSocketObject, now);

        // If the business card exists, replace it.
        for (object of vm.businessCards) {
            if (object.ID == webSocketObject.ID) {
                add = false;
                var i = vm.businessCards.indexOf(object);
                vm.businessCards.splice(i, 1);
                vm.businessCards.push(webSocketObject);
            }
        }
        if (add) {
            vm.businessCards.push(webSocketObject);
        }

        // Add businessCards to session storage.
        webStorage.session.add("businessCards", vm.businessCards);

        // Update view.
        $scope.$apply();
    });

    ws.$on('$close', function() {
        console.log('[SystemComponentsController] Websocket closed ' + addr);
    });

    // Check if component's businesscard is expired.
    setInterval(function() {
        var now = new Date().getTime();
        for (component of vm.businessCards) {
            component.status = getStatus(component, now);

        }
    }, SYSCOMPONENTS.SYSTEM_COMPONENTS.STATUS_CHECK_INTERVAL);
}