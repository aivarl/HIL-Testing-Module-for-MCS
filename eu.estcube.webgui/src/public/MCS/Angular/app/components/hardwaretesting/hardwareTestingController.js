/**
 * Controller for checking system components.
 */
// Add controller to module.
angular
    .module('MCS')
    .controller('HardwareTestingController', HardwareTestingController);


function HardwareTestingController(HRDWRTESTING, CONFIG, httpService, $timeout, $http, $scope, $websocket, $location, $indexedDB, webStorage) {
    var vm = this;

    $scope.log = [];

    //TODO use the ace editor in final product, so the script can be modified before starting
//    ace.require("ace/ext/language_tools");
//    ace.require("ace/ext/error_marker");
//
//    var editor = ace.edit("editor");
//    editor.setTheme("ace/theme/monokai");
//    editor.getSession().setMode("ace/mode/mcsscript");
//
//    editor.setOptions({
//        enableBasicAutocompletion: true
//    });
//
//    $scope.editor = editor;

    /**
     * START TEST
     */
    $scope.testStatus = "STOPPED";
    $scope.startTest = function () {
    	console.log("startTest()");
    	$scope.testStatus = "STARTED";
    	$scope.scriptLog = "STARTING SCRIPT...";
    }
    /**
     * STOP TEST
     */
    $scope.stopTest = function () {
    	console.log("stopTest()");
    	$scope.testStatus = "STOPPED";
    	
    }
    /**
     * LOAD TEST
     */
    $scope.scriptLog = "NO SCRIPT LOADED";
    $scope.loadTest = function () {
    	console.log("loadTest()");
    	var f = document.getElementById('file').files[0],
        r = new FileReader();
	    r.onloadend = function(e){
	      var data = e.target.result;
	      //send you binary data via $http or $resource or do anything else with it
	      console.log(data);
	      $scope.scriptLog = data;
	      $scope.$apply();
	    }
	    r.readAsBinaryString(f);
    }
    
    $scope.sendCommand = function () {
    	console.log("sendCommand()");
    	console.log($scope.command);
    }
    
    $scope.runScript = function () {
        editor.getSession().clearAnnotations();

        var code = editor.getSession().getValue();

        $http({
            method: 'POST',
            url: "http://" + $location.host() + ":" + $location.port() + CONFIG.TOPIC_SCRIPT_SUBMIT,
            headers: {'Content-Type': 'application/json'},
            data:  {"code": code}
        }).success(function (data) {
            $scope.appendLog("Engine", "Script sent...");
        });
    }

    $scope.getTypeColor = function(type) {
        switch(type) {
        case "Info": return "black";
        case "Error": return "red";
        default: return "orange";
        }
    };

    $scope.appendLog = function(type, msg) {
        $timeout(function(){
            $scope.log.push({
                type: type,
                msg: msg
            });
        });
    };

    // Business cards web socket url.
    var addr = "ws://" + $location.host() + ":" + CONFIG.WEB_SOCKET_PORT + CONFIG.WEBSOCKET_SCRIPTOUTPUT;
    var ws = $websocket.$new(addr); // instance of ngWebsocket, handled by $websocket service

    ws.$on('$open', function() {
        console.log('[SystemComponentsController] websocket open ' + addr);
    });

    ws.$on('$message', function(data) {
        var msg = JSON.parse(data);

        if (msg.extraInfo && msg.extraInfo.type == "compileError") {
            editor.getSession().setAnnotations([{
                row: msg.extraInfo.row - 1,
                column: msg.extraInfo.column - 1,
                text: msg.extraInfo.message,
                type: "error"
            }]);
        }
        if (msg.scriptIdentifier == "engine") {
            $scope.appendLog("Engine", msg.message);
        } else {
            $scope.appendLog(msg.type, msg.message);
        }

        console.log(msg);
    });

    ws.$on('$close', function() {
        console.log('[SystemComponentsController] Websocket closed ' + addr);
    });
}