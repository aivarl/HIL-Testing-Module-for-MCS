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
    ace.require("ace/ext/language_tools");
    ace.require("ace/ext/error_marker");

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");//applescript for light
    editor.getSession().setMode("ace/mode/mcsscript");

    editor.setOptions({
        enableBasicAutocompletion: true
    });

    $scope.editor = editor;


    //Groovy States to be added to TEST RESULTS
    $scope.tests = [];

    $scope.fileName = "No file loaded";
    $scope.portStatusType = "Info";
    $scope.portStatusMessage = "Not connected";
    /**
     * GET SERIAL PORTS
     */
    $scope.serialPorts;
    $scope.getSerialPorts = function(){
    	var result;
        $http({
            method: 'GET',
            url: "http://" + $location.host() + ":" + $location.port() + CONFIG.TOPIC_HARDWARE_TEST_PORTS,
            headers: {'Content-Type': 'application/json'},
        }).success(function (data) {
        	console.log("GOT SERIAL PORTS:");
        	console.log(data.ports);
        	$scope.serialPorts = data.ports;
        }).error(function(){
        	$scope.serialPorts = "Error retrieving serial ports";
        });
        return result;
    }
    $scope.getSerialPorts();
    setTimeout(function(){
    	console.log("scope.serialporst");
    	console.log($scope.serialPorts);
    }, 3500);
    /**
     * CONNECT HARDWARE
     */
    $scope.connectHardware = function(){
    	console.log("Conencting hardware...");
    	console.log($scope.selectedPort);
    	$scope.submitToServlet("code", 'send "CONNECT:'+$scope.selectedPort[0]+'"');
    }
    /**
     * DISCONNECT HARDWARE
     */
    $scope.disconnectHardware = function(){
    	console.log("Disconencting hardware...");
    	$scope.submitToServlet("code", 'send "DISCONNECT"');
    }
    /**
     * START TEST
     */
    $scope.testStatus = "STOPPED";
    $scope.startTest = function () {
    	$scope.scriptCode = editor.getSession().getValue();
    	//Gather the states
	    $scope.tests = $scope.getCodeStates($scope.scriptCode);
    	
    	console.log("startTest()");
    	$scope.testStatus = "STARTED";
    	$scope.script = $scope.scriptLog;
    	$scope.scriptLog = "STARTING SCRIPT...";
    
		$scope.submitToServlet("code", $scope.scriptCode);

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
    $scope.scriptLog = "";
    $scope.loadTest = function () {
    	console.log("loadTest()");
    	var f = document.getElementById('file').files[0],
        r = new FileReader();
	    r.onloadend = function(e){
	      var data = e.target.result;
	      //send you binary data via $http or $resource or do anything else with it
	      console.log(data);
	      editor.getSession().setValue(data);
	      //$scope.scriptLog = data;
	      //$scope.$apply();
	    }
	    $scope.fileName = document.getElementById('file').files[0].name;
	    r.readAsBinaryString(f);
    }
    /**
     * SEND SINGLE COMMAND
     */
    $scope.sendCommand = function () {
    	console.log("sendCommand()");
    	console.log($scope.command);
    	
    	$scope.submitToServlet("code", $scope.command);


    }
    
    $scope.submitToServlet = function(type, commands){
        $http({
            method: 'POST',
            url: "http://" + $location.host() + ":" + $location.port() + CONFIG.TOPIC_HARDWARE_TEST_SUBMIT,
            headers: {'Content-Type': 'application/json'},
            data:  {"type" : type, "code": commands}
        }).success(function (data) {
            console.log("POST single command success:");
            console.log(data);
            $scope.scriptLog = data;
            //$scope.$apply();
        });
    }

    /**
     * Finds all code states (e.g. "state (Main)") and returns them as an array.
     */
    $scope.getCodeStates = function (code) {
    	var string = code,
        pattern = /state\s*\((.+?)\)/g,
        match,
        matches = [];

	    while (match = pattern.exec(string)) {
	        matches.push(match[1]);
	    }
	    
	    var testResultObjects = [];
	    for(state of matches){
	    	var testResultObject = {name: state, result:"-", reason:"-"};
	    	testResultObjects.push(testResultObject);
	    }
	    return testResultObjects;
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

    /**
     * SAVE TEST RESULTS
     */
    $scope.saveTestResults = function () {
    	console.log("saveTestResults()");
    	var elem = document.getElementById('testResults');
    	console.log(elem);
    	saveTextAs(elem.outerHTML, "test.html");
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


    /**
     * HARDWARE TESTING WEBSOCKET
     */
    var htaddr = "ws://" + $location.host() + ":" + CONFIG.WEB_SOCKET_PORT + CONFIG.WEBSOCKET_HARDWARETESTINGOUTPUT;
    var htws = $websocket.$new(htaddr); // instance of ngWebsocket, handled by $websocket service

    htws.$on('$open', function() {
        console.log('[SystemComponentsController] websocket open ' + htaddr);
    });

    htws.$on('$message', function(data) {
        var msg = JSON.parse(data);

        console.log("INFO FROM HARDWARE TESTING WEBSOCKET:");
        console.log(msg);
        $scope.portStatusType = msg.type;
        $scope.appendLog(msg.type, msg.message);
        if(msg.type.startsWith("Connection")){
        	$scope.portStatusMessage = msg.message;
        }
        $scope.$apply();
    });

    htws.$on('$close', function() {
        console.log('[SystemComponentsController] Websocket closed ' + htaddr);
    });

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
        }
    	else if(msg.scriptIdentifier == "Info" && msg.message == "Script done."){
    		$scope.appendLog(msg.type, msg.message);
    		for(test of $scope.tests){
    			console.log(test);
    			if(test.result != "FAILED"){
    				test.result = "PASSED";
    			}
    			else{
    				return;
    			}
    		}
    	}
        	else if(msg.scriptIdentifier == "exceptionhandler"){
        	var exceptionData = msg.message.split(";");
        	var exceptionState = exceptionData[0];
        	var exceptionLineNumber = exceptionData[1];
        	var exceptionReason = exceptionData[2];
        	console.log("EXCEPTIONDATA:");
        	console.log(exceptionData);
        	var exceptionMessage = "";
        	for(test of $scope.tests){
        		if(test.name == exceptionState){
        			test.result = "FAILED";
        			test.reason = "Line: " + exceptionLineNumber + ";\n Cause:\n" + exceptionReason;
        			exceptionMessage = "TEST " + test.name + " FAILED: " + test.reason;
        		}
        	}
        	if(exceptionMessage == ""){
        		exceptionMessage = "TEST FAILED: " + exceptionLineNumber;
        	}
        	$scope.appendLog("ExceptionHandler", exceptionMessage);
        }
        else {
            $scope.appendLog(msg.type, msg.message);
        }

        console.log(msg);
    });

    ws.$on('$close', function() {
        console.log('[SystemComponentsController] Websocket closed ' + addr);
    });
    
    
    /**
     * Temporary solution for scrolling the script log window automatically.
     */
    window.setInterval(function() {
    	  var elem = document.getElementById('logWindow');
    	  elem.scrollTop = elem.scrollHeight;
    	}, 100);
    
}