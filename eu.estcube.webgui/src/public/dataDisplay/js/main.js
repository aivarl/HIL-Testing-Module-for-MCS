// Function for extracting & grouping websocket data

function webSocketObject2Table(webSocketObject) {

    var name;
    var description;
    var formatPattern;
    var calibratedValue;
    var value;
    var unit;
    var onOff;
    var tableRow;
    
    var timestamp;

    name = webSocketObject.name;
    description = webSocketObject.description;
    formatPattern = webSocketObject.formatPattern;
    calibratedValue = webSocketObject.calibratedValue;
    value = sprintf(formatPattern, calibratedValue);
    timestamp = webSocketObject.timestamp;
    
    if(webSocketObject.ID.indexOf("/ESTCUBE/Satellites/ESTCube-1") > -1 && timestamp != undefined) {
        timestampDate = new Date(timestamp);
//        tableViewModel.timestamp(timestampDate.toString().slice(0,-20));
        tableViewModel.timestamp(timestampDate.toUTCString());
    }
    
    if (formatPattern == undefined) {
        value = calibratedValue;
    }
    unit = webSocketObject.unit;

    if (webSocketObject.class == "CalibratedParameter") {

        if (unit == "1=ON, 0=OFF" || unit == "ADU" || unit == "ver" || unit == "count") {
            unit = "";
        }
        if (webSocketObject.ID
                .indexOf("/ESTCUBE/Satellites/ESTCube-1/CDHS//version") > -1) {
            value = "0x" + value.toUpperCase();
        }
        tableRow = new TableData(name, description, value, unit);

        if (webSocketObject.ID.indexOf("/ESTCUBE/Satellites/ESTCube-1/CDHS//") > -1) {

            groupVectorsXYZ(description, value);
            tableViewModel.replaceAdcsSun1Row(tableRow);
            tableViewModel.replaceAdcsSun2Row(tableRow);
            tableViewModel.replaceCdhsRow(tableRow);

        } else if (webSocketObject.ID
                .indexOf("/ESTCUBE/Satellites/ESTCube-1/EPS//") > -1) {
            if (description.indexOf("charge") > -1) {
                batteryProgress(description, value);
                batteryProgressBarChange();
            }
            if (value != "ON" && value != "OFF") {
                // tableViewModel.replaceEpsCtlRow(tableRow);
                groupRegulators(description, value, unit);
            } else {

                switch2onOff(description, value);

                tableViewModel.replaceEpsSwitchRow(tableRow);
            }
            tableViewModel.replaceEpsBatATempRow(tableRow);
            tableViewModel.replaceEpsBatBTempRow(tableRow);
            tableViewModel.replaceEpsTempRow(tableRow);
            // COM forward, reflected and temperature data comes from EPS's
            // getdebug command
            tableViewModel.replaceComRow(tableRow);

        } else if (webSocketObject.ID
                .indexOf("/ESTCUBE/Satellites/ESTCube-1/COM//") > -1) {
            tableViewModel.replaceComRow(tableRow);
        } else if (webSocketObject.ID
                .indexOf("/ESTCUBE/Satellites/ESTCube-1/CAM//") > -1) {
            if (tableRow.name == "version") {
                value = (tableRow.value).toString(16);
                value = "0x" + value.toUpperCase();
                tableRow.value = value;
            }
            tableViewModel.addCamRow(tableRow);
        } else if (webSocketObject.ID
                .indexOf("/ESTCUBE/Satellites/ESTCube-1/ADCS//") > -1) {
            tableViewModel.addAcdsRow(tableRow);
        }
    }
}

var webSocket;
var webSocketMessage;
var webSocketObject;

function openSocket() {
    console.log("Websocket opened.");

    // Ensures only one connection is open at a time
    if (webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED) {
        writeResponse("WebSocket is already opened.");
        return;
    }
    // .webgui/MCS/config/config.js
    webSocket = new WebSocket("ws://ariane.physic.ut.ee:1337/hbird.out.parameters");
    // Log errors
    webSocket.onerror = function(error) {
        console.log('WebSocket Error ' + error);
    };
    /**
     * Binds functions to the listeners for the websocket.
     */
    webSocket.onopen = function(event) {
        // For reasons I can't determine, onopen gets called twice
        // and the first time event.data is undefined.
        if (event.data === undefined)
            return;
    };
    // Reading messages from websocket
    webSocket.onmessage = function(event) {
        webSocketMessage = event.data;
        webSocketObject = JSON.parse(webSocketMessage);
        webSocketObject2Table(webSocketObject);
    };
    webSocket.onclose = function(event) {
        console.log("Websocket closed.");
        setTimeout(function() {
            openSocket()
        }, 15000);
    };
}

function closeSocket() {
    webSocket.close();
}

function writeResponse(text) {
    var messages = document.getElementById("messages");
    messages.innerHTML += "<br/>" + text;
}

// KNOCKOUTJS

// Class to represent a data row
function TableData(name, description, value, unit) {
    var self = this;
    self.name = name;
    self.description = description;
    self.value = value;
    self.unit = unit;
    self.onOff = "null";
}

// Class to represent a data row of vectors (ADCS and some data from EPS)
function TableDataXYZ(name, description, valueX, valueY, valueZ, unit) {
    var self = this;
    self.name = name;
    self.description = description;
    self.valueX = valueX;
    self.valueY = valueY;
    self.valueZ = valueZ;
    self.unit = unit;
    self.onOff = "null";
}

// Class to represent a data row of values and corresponding switches(EPS -
// regulators)
function TableDataSwitch(name, description, value, unit, valueA, unitA, valueB,
        unitB, onOffA, onOffB) {
    var self = this;
    self.name = name;
    self.description = description;
    self.value = value;
    self.unit = unit;
    self.valueA = valueA;
    self.unitA = unitA;
    self.valueB = valueB;
    self.unitB = unitB;
    self.onOffA = onOffA;
    self.onOffB = onOffB;
}

// Overall viewmodel
function TableDataViewModel() {

    var self = this;
    
    self.timestamp = ko.observable();
    
    self.batACharge = ko.observable();
    self.batADischarge = ko.observable();
    self.batBCharge = ko.observable();
    self.batBDischarge = ko.observable();
    self.batProgressA = ko.observable(); // for battery charge/discharge
    // progress bar
    self.batProgressB = ko.observable(); // for battery charge/discharge
    // progress bar

    self.pushItem = function(array, tableRow) {
        array.push(tableRow);
    }

    self.pushOrReplaceItem = function(array, tableRow) {
        var match = ko.utils.arrayFirst(array(), function(item) {
            if (tableRow.description != "") {
                return tableRow.description === item.description;
            } else {
                return tableRow.name === item.name;
            }
        });
        if (match) {
            array.replace(match, tableRow);
        } else {
            array.push(tableRow);
        }
    }

    // Replace if value is in array
    self.replaceItem = function(array, tableRow) {
        var match = ko.utils.arrayFirst(array(), function(item) {
            return tableRow.description === item.description;
        });
        if (match) {
            array.replace(match, tableRow);
        }
    }

    // CDHS

    // CDHS - data array
    self.cdhsRows = ko.observableArray([]);
    // CDHS - add data
    self.addCdhsRow = function(tableRow) {
        self.pushItem(self.cdhsRows, tableRow);
    }
    // CDHS - replace data
    self.replaceCdhsRow = function(tableRow) {
        self.replaceItem(self.cdhsRows, tableRow);
    }

    // EPS

    // SOLAR CELLS - data array
    self.epsSolarRows = ko.observableArray([]);
    // SOLAR CELLS - add data
    self.addEpsSolarRow = function(tableRow) {
        self.pushItem(self.epsSolarRows, tableRow);
    }
    // SOLAR CELLS - replace data
    self.replaceEpsSolarRow = function(tableRow) {
        self.replaceItem(self.epsSolarRows, tableRow);
    }
    // REGULATORS - data array
    self.epsRegRows = ko.observableArray([]);
    self.epsCtlRows = ko.observableArray([]);
    self.epsCtlPlRows = ko.observableArray([]);
    self.epsCtlPl12Rows = ko.observableArray([]);
    // REGULATORS - add data
    self.addEpsRegRow = function(tableRow) {
        self.pushItem(self.epsRegRows, tableRow);
    }
    self.addEpsCtlRow = function(tableRow) {
        self.pushItem(self.epsCtlRows, tableRow);
    }
    self.addEpsCtlPlRow = function(tableRow) {
        self.pushItem(self.epsCtlPlRows, tableRow);
    }
    // REGULATORS - replace data
    self.replaceEpsRegRow = function(tableRow) {
        self.replaceItem(self.epsRegRows, tableRow);
    }
    self.replaceEpsCtlRow = function(tableRow) {
        self.replaceItem(self.epsCtlRows, tableRow);
    }
    self.replaceEpsCtlPlRow = function(tableRow) {
        self.replaceItem(self.epsCtlPlRows, tableRow);
    }
    self.replaceEpsCtlPl12Row = function(tableRow) {
        self.replaceItem(self.epsCtlPl12Rows, tableRow);
    }
    // COILS - data array
    self.epsCoilRows = ko.observableArray([]);
    // COILS - add data
    self.addEpsCoilRow = function(tableRow) {
        self.pushItem(self.epsCoilRows, tableRow);
    }
    // COILS - replace data
    self.replaceEpsCoilRow = function(tableRow) {
        self.replaceItem(self.epsCoilRows, tableRow);
    }
    // BATTERIES - data array
    self.epsBatteryRows = ko.observableArray([]);
    self.epsBatterySPBRows = ko.observableArray([]);
    self.epsBatARows = ko.observableArray([]);
    self.epsBatATempRows = ko.observableArray([]);
    self.epsBatBRows = ko.observableArray([]);
    self.epsBatBTempRows = ko.observableArray([]);
    // BATTERIES - add data
    self.addEpsBatteryRow = function(tableRow) {
        self.pushItem(self.epsBatteryRows, tableRow);
    }
    self.addEpsBatterySPBRow = function(tableRow) {
        self.pushItem(self.epsBatterySPBRows, tableRow);
    }
    self.addEpsBatARow = function(tableRow) {
        self.pushItem(self.epsBatARows, tableRow);
    }
    self.addEpsBatATempRow = function(tableRow) {
        self.pushItem(self.epsBatATempRows, tableRow);
    }
    self.addEpsBatBRow = function(tableRow) {
        self.pushItem(self.epsBatBRows, tableRow);
    }
    self.addEpsBatBTempRow = function(tableRow) {
        self.pushItem(self.epsBatBTempRows, tableRow);
    }
    // BATTERIES - replace data
    self.replaceEpsBatteryRow = function(tableRow) {
        self.replaceItem(self.epsBatteryRows, tableRow);
    }
    self.replaceEpsBatterySPBRow = function(tableRow) {
        self.replaceItem(self.epsBatterySPBRows, tableRow);
    }
    self.replaceEpsBatARow = function(tableRow) {
        self.replaceItem(self.epsBatARows, tableRow);
    }
    self.replaceEpsBatATempRow = function(tableRow) {
        self.replaceItem(self.epsBatATempRows, tableRow);
    }
    self.replaceEpsBatBRow = function(tableRow) {
        self.replaceItem(self.epsBatBRows, tableRow);
    }
    self.replaceEpsBatBTempRow = function(tableRow) {
        self.replaceItem(self.epsBatBTempRows, tableRow);
    }
    // SWITCHES - data array
    self.epsSwitchRows = ko.observableArray([]);
    // SWITCHES - add data
    self.addEpsSwitchRow = function(tableRow) {
        self.pushItem(self.epsSwitchRows, tableRow);
    }
    // SWITCHES - replace data
    self.replaceEpsSwitchRow = function(tableRow) {
        self.replaceItem(self.epsSwitchRows, tableRow);
    }
    // TEMPERATURES - data array
    self.epsTempRows = ko.observableArray([]);
    // TEMPERATURES - add data
    self.addEpsTempRow = function(tableRow) {
        self.pushItem(self.epsTempRows, tableRow);
    }
    // TEMPERATURES - replace data
    self.replaceEpsTempRow = function(tableRow) {
        self.replaceItem(self.epsTempRows, tableRow);
    }

    // COM

    // COM - data array
    self.comRows = ko.observableArray([]);
    // COM - add data
    self.addComRow = function(tableRow) {
        self.pushOrReplaceItem(self.comRows, tableRow);
    }
    // COM - replace data
    self.replaceComRow = function(tableRow) {
        self.replaceItem(self.comRows, tableRow);
    }

    // CAM

    // CAM - data array
    self.camRows = ko.observableArray([]);
    // CAM - add data
    self.addCamRow = function(tableRow) {
        self.pushOrReplaceItem(self.camRows, tableRow);
    }

    // ADCS

    // GYROS - data array
    self.adcsGyroVectorRows = ko.observableArray([]);
    self.adcsGyroRows = ko.observableArray([]);
    // GYROS - add data
    self.addAdcsGyroVectorRow = function(tableRow) {
        self.pushItem(self.adcsGyroVectorRows, tableRow);
    }
    self.addAdcsGyroRow = function(tableRow) {
        self.pushItem(self.adcsGyroRows, tableRow);
    }
    // GYROS - replace data
    self.replaceAdcsGyroVectorRow = function(tableRow) {
        self.replaceItem(self.adcsGyroVectorRows, tableRow);
    }
    self.replaceAdcsGyroRow = function(tableRow) {
        removeString(tableRow, " measurement.");
        self.replaceItem(self.adcsGyroRows, tableRow);
    }
    // SUN SENSORS - data array
    self.adcsSunVectorRows = ko.observableArray([]);
    self.adcsSun1Rows = ko.observableArray([]);
    self.adcsSun2Rows = ko.observableArray([]);
    // SUN SENSORS - add data
    self.addAdcsSunVectorRow = function(tableRow) {
        self.pushItem(self.adcsSunVectorRows, tableRow);
    }
    self.addAdcsSun1Row = function(tableRow) {
        removeString(tableRow, "measurement ");
        self.pushItem(self.adcsSun1Rows, tableRow);
    }
    self.addAdcsSun2Row = function(tableRow) {
        removeString(tableRow, "measurement ");
        self.pushItem(self.adcsSun2Rows, tableRow);
    }
    // SUN SENSORS - replace data
    self.replaceAdcsSunVectorRow = function(tableRow) {
        self.replaceItem(self.adcsSunVectorRows, tableRow);
    }
    self.replaceAdcsSun1Row = function(tableRow) {
        removeString(tableRow, "measurement ");
        self.replaceItem(self.adcsSun1Rows, tableRow);
    }
    self.replaceAdcsSun2Row = function(tableRow) {
        removeString(tableRow, "measurement ");
        self.replaceItem(self.adcsSun2Rows, tableRow);
    }
    // MAGNETOMETERS - data array
    self.adcsMagnetoVectorRows = ko.observableArray([]);
    self.adcsMagnetoRows = ko.observableArray([]);
    // MAGNETOMETERS - add data
    self.addAdcsMagnetoVectorRow = function(tableRow) {
        self.pushItem(self.adcsMagnetoVectorRows, tableRow);
    }
    self.addAdcsMagnetoRow = function(tableRow) {
        self.pushItem(self.adcsMagnetoRows, tableRow);
    }
    // MAGNETOMETERS - replace data
    self.replaceAdcsMagnetoVectorRow = function(tableRow) {
        self.replaceItem(self.adcsMagnetoVectorRows, tableRow);
    }
    self.replaceAdcsMagnetoRow = function(tableRow) {
        removeString(tableRow, " measurement.");
        self.replaceItem(self.adcsMagnetoRows, tableRow);
    }
    // GETTM2 - data array
    self.adcsAngVectorRows = ko.observableArray([]);
    self.adcsTorqueRows = ko.observableArray([]);
    self.adcsMagnetMomentVectorRows = ko.observableArray([]);
    // GETTM2 - add data
    self.addAdcsAngVectorRow = function(tableRow) {
        self.pushItem(self.adcsAngVectorRows, tableRow);
    }
    self.addAdcsTorqueRow = function(tableRow) {
        self.pushItem(self.adcsTorqueRows, tableRow);
    }
    self.addAdcsMagnetMomentVectorRow = function(tableRow) {
        self.pushItem(self.adcsMagnetMomentVectorRows, tableRow);
    }
    // GETTM2 - replace data
    self.replaceAdcsAngVectorRow = function(tableRow) {
        self.replaceItem(self.adcsAngVectorRows, tableRow);
    }
    self.replaceAdcsTorqueRow = function(tableRow) {
        self.replaceItem(self.adcsTorqueRows, tableRow);
    }
    self.replaceAdcsMagnetMomentVectorRow = function(tableRow) {
        self.replaceItem(self.adcsMagnetMomentVectorRows, tableRow);
    }

    this.flashUpdatedElement = function(elem) {
        $(elem).effect("highlight", {
            backgroundColor : "#96eecd"
        }, 500);
    }

    this.loadDataFromFile = function() {

        $
                .ajax({
                    global : false,
                    type : "POST",
                    cache : false,
                    dataType : "json",
                    data : ({
                        action : 'read'
                    }),
                    url : 'dataToFile.php',
                    success : function(result) {
                        var data = JSON.parse(result);

                        /*
                         * Cannot use knockout's mapping plugin for some reason
                         * (data-binding didn't work after loading data from
                         * file). Have to manually map all arrays.
                         */
                        self.timestamp(data.timestamp);
                        (self.epsSolarRows).push.apply(self.epsSolarRows,
                                data.epsSolarRows);
                        (self.epsCoilRows).push.apply(self.epsCoilRows,
                                data.epsCoilRows);
                        (self.epsBatteryRows).push.apply(self.epsBatteryRows,
                                data.epsBatteryRows);
                        (self.epsBatterySPBRows).push.apply(
                                self.epsBatterySPBRows, data.epsBatterySPBRows);
                        (self.epsBatARows).push.apply(self.epsBatARows,
                                data.epsBatARows);
                        (self.epsBatATempRows).push.apply(self.epsBatATempRows,
                                data.epsBatATempRows);
                        self.batProgressA(data.batProgressA);
                        (self.epsBatBRows).push.apply(self.epsBatBRows,
                                data.epsBatBRows);
                        (self.epsBatBTempRows).push.apply(self.epsBatBTempRows,
                                data.epsBatBTempRows);
                        self.batProgressB(data.batProgressB);
                        (self.epsRegRows).push.apply(self.epsRegRows,
                                data.epsRegRows);
                        (self.epsCtlPlRows).push.apply(self.epsCtlPlRows,
                                data.epsCtlPlRows);
                        (self.epsCtlPl12Rows).push.apply(self.epsCtlPl12Rows,
                                data.epsCtlPl12Rows);
                        (self.epsCtlRows).push.apply(self.epsCtlRows,
                                data.epsCtlRows);
                        (self.epsSwitchRows).push.apply(self.epsSwitchRows,
                                data.epsSwitchRows);
                        (self.epsTempRows).push.apply(self.epsTempRows,
                                data.epsTempRows);

                        (self.cdhsRows).push
                                .apply(self.cdhsRows, data.cdhsRows);

                        (self.comRows).push.apply(self.comRows, data.comRows);

                        (self.adcsAngVectorRows).push.apply(
                                self.adcsAngVectorRows, data.adcsAngVectorRows);
                        (self.adcsGyroRows).push.apply(self.adcsGyroRows,
                                data.adcsGyroRows);
                        (self.adcsGyroVectorRows).push.apply(
                                self.adcsGyroVectorRows,
                                data.adcsGyroVectorRows);
                        (self.adcsMagnetMomentVectorRows).push.apply(
                                self.adcsMagnetMomentVectorRows,
                                data.adcsMagnetMomentVectorRows);
                        (self.adcsMagnetoRows).push.apply(self.adcsMagnetoRows,
                                data.adcsMagnetoRows);
                        (self.adcsMagnetoVectorRows).push.apply(
                                self.adcsMagnetoVectorRows,
                                data.adcsMagnetoVectorRows);
                        (self.adcsSun1Rows).push.apply(self.adcsSun1Rows,
                                data.adcsSun1Rows);
                        (self.adcsSun2Rows).push.apply(self.adcsSun2Rows,
                                data.adcsSun2Rows);
                        (self.adcsSunVectorRows).push.apply(
                                self.adcsSunVectorRows, data.adcsSunVectorRows);
                        (self.adcsTorqueRows).push.apply(self.adcsTorqueRows,
                                data.adcsTorqueRows);

                        (self.camRows).push.apply(self.camRows, data.camRows);
                    }
                });
    }

}
var tableViewModel = new TableDataViewModel();
tableViewModel.loadDataFromFile();
ko.applyBindings(tableViewModel);

openSocket();

setInterval(function() {
    saveData2File();
    console.log("Saving...");
}, 15000);

function saveData2File() {
    var data = ko.toJSON(tableViewModel);/* data in JSON format */
    $.ajax({
        global : false,
        type : "POST",
        cache : false,
        dataType : "json",
        data : ({
            action : 'write',
            data : data
        }),
        url : 'dataToFile.php'
    });
}

function batteryProgress(description, value) {
    var batA = "Battery A";
    var batB = "Battery B";
    var battery;
    if (description.indexOf(batA) > -1) {
        battery = batA;
    } else {
        battery = batB;
    }
    if (description.indexOf(" charge") > -1) {
        if (value == "ON") {
            if (battery == batA) {
                tableViewModel.batACharge(1);
            } else if (battery == batB) {
                tableViewModel.batBCharge(1);
            }
        } else {
            if (battery == batA) {
                tableViewModel.batACharge(0);
            } else if (battery == batB) {
                tableViewModel.batBCharge(0);
            }
        }
    }
    if (description == battery + " discharge") {
        if (value == "ON") {
            if (battery == batA) {
                tableViewModel.batADischarge(1);
            } else if (battery == batB) {
                tableViewModel.batBDischarge(1);
            }
        } else {
            if (battery == batA) {
                tableViewModel.batADisharge(0);
            } else if (battery == batB) {
                tableViewModel.batBDischarge(0);
            }
        }
    }
}
function batteryProgressBarChange(){
    if (tableViewModel.batACharge() == 1 && tableViewModel.batADischarge() == 1) {
        tableViewModel
                .batProgressA("<div class='progress'><div class='progress-bar progress-bar-striped active progress-bar-warning' role='progressbar' aria-valuenow='1000000' aria-valuemin='0' aria-valuemax='100' style='width:100%'>Charging and discharging</div></div>");
    } else if (tableViewModel.batACharge() == 1
            && tableViewModel.batADischarge() == 0) {
        tableViewModel.batProgressA("<div class='progress'><div class='progress-bar progress-bar-striped active progress-bar-success' role='progressbar' aria-valuenow='1000000' aria-valuemin='0' aria-valuemax='100' style='width:100%'>Charging</div></div>");
    } else if (tableViewModel.batACharge() == 0
            && tableViewModel.batADischarge() == 1) {
        tableViewModel
                .batProgressA("<div class='progress'><div class='progress-bar progress-bar-striped active progress-bar-danger' role='progressbar' aria-valuenow='1000000' aria-valuemin='0' aria-valuemax='100' style='width:100%'>Discharging</div></div>");
    } else if (tableViewModel.batACharge() == 0
            && tableViewModel.batADischarge() == 0) {
        tableViewModel.batProgressA("<div class='progress'><div class='progress-bar progress-bar-striped progress-bar-info' role='progressbar' aria-valuenow='1000000' aria-valuemin='0' aria-valuemax='100' style='width:100%'>Idle</div></div>");
    }

    if (tableViewModel.batBCharge() == 1 && tableViewModel.batBDischarge() == 1) {
        tableViewModel
                .batProgressB("<div class='progress'><div class='progress-bar progress-bar-striped active progress-bar-warning' role='progressbar' aria-valuenow='1000000' aria-valuemin='0' aria-valuemax='100' style='width:100%'>Charging and discharging</div></div>");
    } else if (tableViewModel.batBCharge() == 1
            && tableViewModel.batBDischarge() == 0) {
        tableViewModel.batProgressB("<div class='progress'><div class='progress-bar progress-bar-striped active progress-bar-success' role='progressbar' aria-valuenow='1000000' aria-valuemin='0' aria-valuemax='100' style='width:100%'>Charging</div></div>");
    } else if (tableViewModel.batBCharge() == 0
            && tableViewModel.batBDischarge() == 1) {
        tableViewModel
                .batProgressB("<div class='progress'><div class='progress-bar progress-bar-striped active progress-bar-danger' role='progressbar' aria-valuenow='1000000' aria-valuemin='0' aria-valuemax='100' style='width:100%'>Discharging</div></div>");
    } else if (tableViewModel.batBCharge() == 0
            && tableViewModel.batBDischarge() == 0) {
        tableViewModel.batProgressB("<div class='progress'><div class='progress-bar progress-bar-striped progress-bar-info' role='progressbar' aria-valuenow='1000000' aria-valuemin='0' aria-valuemax='100' style='width:100%'>Idle</div></div>");
    }
}

function removeString(tableRow, remove) {
    str = tableRow.description;
    str = str.replace(remove, '');
    tableRow.description = str;
}