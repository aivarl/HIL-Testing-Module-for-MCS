define(["dojo/domReady!"], function() {
    return {
        routes: {
            ESTCube1_BEACONS: {
                path: "ESTCube-1/beacons",
                defaults: {
                    controller: "ESTCube-1.beacons/BeaconsController",
                    method: "index"
                }
            }
        },
        
        ESTCube1_BEACONS: {
            hiddenFields: ["raw", "raw Metadata"],
            defaultRangeStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
            defaultRangeEnd: new Date(Date.now() + 1000 * 60 * 60 * 24)
        }
    }
});