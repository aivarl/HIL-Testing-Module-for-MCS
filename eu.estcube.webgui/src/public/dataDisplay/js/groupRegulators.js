function groupRegulators(description, value, unit) {

    var tableRow;
    var reg3 = "Reg 3V3";
    var reg5 = "Reg 5V";
    var reg12 = "Reg 12V";
    var mppt = "MPPT";
    var mpb = "MPB";
    var spb = "SPB";
    var batA = "Battery A";
    var batB = "Battery B";
    var coil = "Coil";

    if (description.indexOf(reg3 + " ") > -1) {
        tableRow = findRow(tableViewModel.epsRegRows(), reg3);
        position = outAorB(description);
        tableViewModel.replaceEpsRegRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf(reg5 + " ") > -1) {
        tableRow = findRow(tableViewModel.epsRegRows(), reg5);
        position = outAorB(description);
        tableViewModel.replaceEpsRegRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf(reg12 + " ") > -1) {
        tableRow = findRow(tableViewModel.epsRegRows(), reg12);
        position = outAorB(description);
        tableViewModel.replaceEpsRegRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf(mpb + " ") > -1) {
        tableRow = findRow(tableViewModel.epsBatteryRows(), mpb);
        position = outAorB(description);
        tableViewModel.replaceEpsBatteryRow(changeABC(tableRow, position,
                value, unit));
    } else if (description.indexOf(spb + " ") > -1) {
        tableRow = findRow(tableViewModel.epsBatterySPBRows(), spb);
        position = outAorB(description);
        tableViewModel.replaceEpsBatterySPBRow(changeReg(tableRow, position,
                value, unit));
    } else if (description.indexOf(mppt + " ") > -1) {
        tableRow = findRow(tableViewModel.epsSolarRows(), mppt);
        position = outAorB(description);
        tableViewModel.replaceEpsSolarRow(changeABC(tableRow, position, value,
                unit));
    } else if (description.indexOf(batA) > -1
            || description.indexOf("BP A ") > -1) {
        tableRow = findRow(tableViewModel.epsBatARows(), batA);
        position = outAorB(description);
        tableViewModel.replaceEpsBatARow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf(batB) > -1
            || description.indexOf("BP B ") > -1) {
        tableRow = findRow(tableViewModel.epsBatBRows(), batB);
        position = outAorB(description);
        tableViewModel.replaceEpsBatBRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf(coil + " ") > -1) {
        tableRow = findRow(tableViewModel.epsCoilRows(), coil + "s");
        position = outAorB(description);
        tableViewModel.replaceEpsCoilRow(changeABC(tableRow, position, value,
                unit));
    }
    // Grouping controllers (EPS -> Regulators)
    else if (description.indexOf("CTL PL 3V3") > -1) {
        tableRow = findRow(tableViewModel.epsCtlPlRows(), "CTL PL 3V3");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlPlRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf("CTL PL 5V") > -1) {
        tableRow = findRow(tableViewModel.epsCtlPlRows(), "CTL PL 5V");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlPlRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf("CTL PL 12v") > -1) {
        tableRow = findRow(tableViewModel.epsCtlPl12Rows(), "CTL PL 12v");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlPl12Row(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf("CTL COM 3V3") > -1) {
        tableRow = findRow(tableViewModel.epsCtlRows(), "CTL COM 3V3");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf("CTL COM 5V") > -1) {
        tableRow = findRow(tableViewModel.epsCtlRows(), "CTL COM 5V");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf("CTL CDHS A") > -1) {
        tableRow = findRow(tableViewModel.epsCtlRows(), "CTL CDHS A 3V3");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf("CTL CDHS B") > -1) {
        tableRow = findRow(tableViewModel.epsCtlRows(), "CTL CDHS B 3V3");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf("CTL CDHS bsw") > -1) {
        tableRow = findRow(tableViewModel.epsCtlRows(), "CTL CDHS bsw 3V3");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf("CTL ADCS") > -1) {
        tableRow = findRow(tableViewModel.epsCtlRows(), "CTL ADCS 5v");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlRow(changeReg(tableRow, position, value,
                unit));
    } else if (description.indexOf("CTL CAM 3V3") > -1) {
        tableRow = findRow(tableViewModel.epsCtlRows(), "CTL CAM 3V3");
        position = outAorB(description);
        tableViewModel.replaceEpsCtlRow(changeReg(tableRow, position, value,
                unit));
    }
}

function outAorB(description) {
    var position;
    if (description.indexOf("OUT") > -1 || description.indexOf("out") > -1) {
        position = 0;
    } else if (description.indexOf("A CS") > -1) {
        position = 1;
    } else if (description.indexOf("B CS") > -1) {
        position = 2;
    } else if (description.indexOf("C CS") > -1) {
        position = 3;
    }

    else if (description.indexOf("avr") > -1) {
        position = 0;
    } else if (description.indexOf("Ext1280") > -1) {
        position = 2;
    } else if (description.indexOf("Ext") > -1) {
        position = 1;
    }

    else if (description == "Battery A") {
        position = 0;
    } else if (description == "Battery B") {
        position = 0;
    } else if (description.indexOf("fb CS") > -1) {
        position = 1;
    } else if (description.indexOf("tb CS") > -1) {
        position = 2;
    }

    if (description.indexOf("CTL ") > -1) {
        if (description.indexOf(" CS") > -1) {
            position = 1;
        } else {
            position = 0;
        }
    }
    if (description.indexOf("MPPT") > -1 || description.indexOf("Coil") > -1) {
        position -= 1;
    }
    return position;
}

function changeReg(tableRow, position, value, unit) {
    var newValue0 = tableRow.value;
    var newUnit0 = tableRow.unit;

    var newValue1 = tableRow.valueA;
    var newUnit1 = tableRow.unitA;

    var newValue2 = tableRow.valueB;
    var newUnit2 = tableRow.unitB;

    if (position == 0) {
        newValue0 = value;
        newUnit0 = unit;
    } else if (position == 1) {
        newValue1 = value;
        newUnit1 = unit;
    } else if (position == 2) {
        newValue2 = value;
        newUnit2 = unit;
    }
    newRow = new TableDataSwitch(tableRow.name, tableRow.description,
            newValue0, newUnit0, newValue1, newUnit1, newValue2, newUnit2);
    return newRow;
}

function changeABC(tableRow, position, value, unit) {
    var newValueX = tableRow.valueX;
    var newValueY = tableRow.valueY;
    var newValueZ = tableRow.valueZ;

    if (position == 0) {
        newValueX = value;
    } else if (position == 1) {
        newValueY = value;
    } else if (position == 2) {
        newValueZ = value;
    }
    newRow = new TableDataXYZ(tableRow.name, tableRow.description, newValueX,
            newValueY, newValueZ, unit);
    return newRow;
}