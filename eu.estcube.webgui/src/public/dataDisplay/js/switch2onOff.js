// Finds corresponding table row from tableViewModel and changes
// onOff value according to data from websocket

function switch2onOff(description, value) {

    var dataRow;
    if (description == "REG SPBA") {
        dataRow = findRow(tableViewModel.epsBatterySPBRows(), "SPB");
        tableViewModel.replaceEpsBatterySPBRow(createSwitchRow(dataRow, value, "A"));
    } else if (description == "REG SPBB") {
        dataRow = findRow(tableViewModel.epsBatterySPBRows(), "SPB");
        tableViewModel.replaceEpsBatterySPBRow(createSwitchRow(dataRow, value, "B"));
    } else if (description == "REG 12VA") {
        dataRow = findRow(tableViewModel.epsRegRows(), "Reg 12V");
        tableViewModel.replaceEpsRegRow(createSwitchRow(dataRow, value, "A"));
         } else if (description == "REG 12VB") {
         dataRow = findRow(tableViewModel.epsRegRows(), "Reg 12V");
         tableViewModel.replaceEpsRegRow(createSwitchRow(dataRow, value, "B"));
         } else if (description == "REG 5VA") {
         dataRow = findRow(tableViewModel.epsRegRows(), "Reg 5V");
         tableViewModel.replaceEpsRegRow(createSwitchRow(dataRow, value, "A"));
         } else if (description == "REG 5VB") {
         dataRow = findRow(tableViewModel.epsRegRows(), "Reg 5V");
         tableViewModel.replaceEpsRegRow(createSwitchRow(dataRow, value, "B"));
         } else if (description == "REG 3V3A") {
         dataRow = findRow(tableViewModel.epsRegRows(), "Reg 3V3");
         tableViewModel.replaceEpsRegRow(createSwitchRow(dataRow, value, "A"));
         } else if (description == "REG 3V3B") {
         dataRow = findRow(tableViewModel.epsRegRows(), "Reg 3V3");
         tableViewModel.replaceEpsRegRow(createSwitchRow(dataRow, value, "B"));
    } else if (description == "CTL COM 3V3") {
        dataRow = findRow(tableViewModel.epsCtlRows(), "CTL COM 3V3");
        tableViewModel.replaceEpsCtlRow(createSwitchRow(dataRow, value, "A"));
    } else if (description == "CTL COM 5V") {
        dataRow = findRow(tableViewModel.epsCtlRows(), "CTL COM 5V");
        tableViewModel.replaceEpsCtlRow(createSwitchRow(dataRow, value, "A"));
    } else if (description == "CTL CDHS 3V3 BSW") {
        dataRow = findRow(tableViewModel.epsCtlRows(), "CTL CDHS bsw 3V3");
        tableViewModel.replaceEpsCtlRow(createSwitchRow(dataRow, value, "A"));
    } else if (description == "CTL CDHS 3V3 A") {
        dataRow = findRow(tableViewModel.epsCtlRows(), "CTL CDHS A 3V3");
        tableViewModel.replaceEpsCtlRow(createSwitchRow(dataRow, value, "A"));
    } else if (description == "CTL CDHS 3V3 B") {
        dataRow = findRow(tableViewModel.epsCtlRows(), "CTL CDHS B 3V3");
        tableViewModel.replaceEpsCtlRow(createSwitchRow(dataRow, value, "A"));
    } else if (description == "CTL ADCS 5V") {
        dataRow = findRow(tableViewModel.epsCtlRows(), "CTL ADCS 5v");
        tableViewModel.replaceEpsCtlRow(createSwitchRow(dataRow, value, "A"));
    } else if (description == "CTL CAM 3V3") {
        dataRow = findRow(tableViewModel.epsCtlRows(), "CTL CAM 3V3");
        tableViewModel.replaceEpsCtlRow(createSwitchRow(dataRow, value, "A"));
    } else if (description == "CTL PL5V") {
        dataRow = findRow(tableViewModel.epsCtlPlRows(), "CTL PL 5V");
        tableViewModel.replaceEpsCtlPlRow(createSwitchRow(dataRow, value, "A"));
    } else if (description == "CTL PL3V3") {
        dataRow = findRow(tableViewModel.epsCtlPlRows(), "CTL PL 3V3");
        tableViewModel.replaceEpsCtlPlRow(createSwitchRow(dataRow, value, "A"));
    }
}

function findRow(array, description) {
    var dataRow = ko.utils.arrayFirst(array, function(item) {
        return item.description === description;
    });
    return dataRow;
}

function createRow(dataRow, onOffValue) {
    newRow = new TableData(dataRow.name, dataRow.description, dataRow.value,
            dataRow.unit);
    newRow.onOff = onOffValue;
    return newRow;
}

function createSwitchRow(dataRow, onOffValue, aORb) {
    newRow = new TableDataSwitch(dataRow.name, dataRow.description, dataRow.value,
            dataRow.unit, dataRow.valueA, dataRow.unitA, dataRow.valueB,
            dataRow.unitB, dataRow.onOffA, dataRow.onOffB);
    if(aORb=="A"){
        newRow.onOffA = onOffValue;
    }
    else if(aORb=="B"){
        newRow.onOffB = onOffValue;
    }
    return newRow;
}