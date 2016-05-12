define(["dojo/domReady!"], function() {
    return {
        routes: {
            ESTCube1_addbeacons: {
                path: "ESTCube-1/addbeacons",
                defaults: {
                    controller: "ESTCube-1.addbeacons/AddBeaconsController",
                    method: "index"
                }
            }
        },

		AddBeacons: {
			CHECK_URL: "/translateRadioBeacon",
			SUBMIT_URL: "/radioBeacon"
		}

    }
});
