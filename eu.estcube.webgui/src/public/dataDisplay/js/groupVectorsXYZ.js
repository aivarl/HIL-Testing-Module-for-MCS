// Function for grouping data with X,Y,Z values into a single row

function groupVectorsXYZ(description, value) {

    var tableRow;

    if (description.indexOf("Magnetic field vector") > -1) {
        tableRow = findRow(tableViewModel.adcsMagnetoVectorRows(),
                "Magnetic field vector X Y Z");
        tableViewModel.replaceAdcsMagnetoVectorRow(groupXYZ(tableRow,
                description, value));
    } else if (description.indexOf("Last magnetometer 0") > -1) {
        tableRow = findRow(tableViewModel.adcsMagnetoRows(),
                "Last magnetometer 0 X Y Z raw");
        tableViewModel.replaceAdcsMagnetoRow(groupXYZ(tableRow, description,
                value));
    } else if (description.indexOf("Last magnetometer 1") > -1) {
        tableRow = findRow(tableViewModel.adcsMagnetoRows(),
                "Last magnetometer 1 X Y Z raw");
        tableViewModel.replaceAdcsMagnetoRow(groupXYZ(tableRow, description,
                value));
    } else if (description.indexOf("Gyro vector") > -1) {
        tableRow = findRow(tableViewModel.adcsGyroVectorRows(),
                "Gyro vector X Y Z");
        tableViewModel.replaceAdcsGyroVectorRow(groupXYZ(tableRow, description,
                value));
    } else if (description.indexOf("Last gyro 0") > -1) {
        tableRow = findRow(tableViewModel.adcsGyroRows(),
                "Last gyro 0 X Y Z raw");
        tableViewModel
                .replaceAdcsGyroRow(groupXYZ(tableRow, description, value));
    } else if (description.indexOf("Last gyro 1") > -1) {
        tableRow = findRow(tableViewModel.adcsGyroRows(),
                "Last gyro 1 X Y Z raw");
        tableViewModel
                .replaceAdcsGyroRow(groupXYZ(tableRow, description, value));
    } else if (description.indexOf("Last gyro 2") > -1) {
        tableRow = findRow(tableViewModel.adcsGyroRows(),
                "Last gyro 2 X Y Z raw");
        tableViewModel
                .replaceAdcsGyroRow(groupXYZ(tableRow, description, value));
    } else if (description.indexOf("Last gyro 3") > -1) {
        tableRow = findRow(tableViewModel.adcsGyroRows(),
                "Last gyro 3 X Y Z raw");
        tableViewModel
                .replaceAdcsGyroRow(groupXYZ(tableRow, description, value));
    } else if (description.indexOf("Sun vector") > -1) {
        tableRow = findRow(tableViewModel.adcsSunVectorRows(),
                "Sun vector X Y Z");
        tableViewModel.replaceAdcsSunVectorRow(groupXYZ(tableRow, description,
                value));
    } else if (description.indexOf("coordinate of the angular velocity vector") > -1) {
        tableRow = findRow(tableViewModel.adcsAngVectorRows(),
                "Angular velocity vector X Y Z");
        tableViewModel.replaceAdcsAngVectorRow(groupXYZ(tableRow, description,
                value));
    } else if (description.indexOf("Torque") > -1) {
        tableRow = findRow(tableViewModel.adcsTorqueRows(), "Torque X Y Z");
        tableViewModel.replaceAdcsTorqueRow(groupXYZ(tableRow, description,
                value));
    } else if (description.indexOf("component of the magnetic moment vector") > -1) {
        tableRow = findRow(tableViewModel.adcsMagnetMomentVectorRows(),
                "Magnetic moment vector X Y Z");
        tableViewModel.replaceAdcsMagnetMomentVectorRow(groupXYZ(tableRow,
                description, value));
    }
}

function groupXYZ(tableRow, description, value) {
    var previousValue;
    previousValue = tableRow.value;
    var newValueX = tableRow.valueX;
    var newValueY = tableRow.valueY;
    var newValueZ = tableRow.valueZ;

    if (description.indexOf("X") > -1) {
        newValueX = value;
    } else if (description.indexOf("Y") > -1) {
        newValueY = value;
    } else if (description.indexOf("Z") > -1) {
        newValueZ = value;
    }
    newRow = new TableDataXYZ(tableRow.name, tableRow.description, newValueX, newValueY, newValueZ,
            tableRow.unit);
    return newRow;
}
