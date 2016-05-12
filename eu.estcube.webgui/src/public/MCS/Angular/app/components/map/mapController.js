/**
 * Controller for creating a map.
 */
// Add controller to module.
angular
    .module('MCS')
    .controller('MapController', MapController);


function MapController(mapService, httpService, $q, ol3Service) {
    var vm = this;

    // Request gs and sat info.
    vm.groundStations = httpService.getGroundStations();
    vm.satellites = httpService.getSatellites();
    
    vm.mapExists = false;
    
    // Waits for all http requests from mapService to complete before creating the map.
    $q.all([vm.groundStations, vm.satellites]).then(function(response) {
        vm.groundStations = response[0].data;
        vm.satellites = response[1].data;

        // Ground stations checkbox data.
        vm.selectedGS = [];
        for(i = 0; i < vm.groundStations.length; i++){
            var selectedObject = {
                    ID: vm.groundStations[i].ID,
                    name: vm.groundStations[i].name,
                    enabled: true
            }
            vm.selectedGS.push(selectedObject);
        }

        // Satellites checkbox data.
        vm.selectedSat = [];
        for(i = 0; i < vm.satellites.length; i++){
            var selectedObject = {
                    ID: vm.satellites[i].ID,
                    name: vm.satellites[i].name,
                    enabled: true
            }
            vm.selectedSat.push(selectedObject);
        }

        // Create the map.
        if(vm.mapExists == false){
            var map = mapService.createMap(vm.groundStations, vm.satellites);
            var map2 = ol3Service.createMap(vm.groundStations, vm.satellites);
            vm.mapExists = true;
        }
    });

    // Remove groundstation from map when checkbox is disabled.
    vm.addOrRemoveGS = function (enabled, gsID){
        mapService.addOrRemoveGroundStation(enabled, gsID)
    }
    // Remove satellite from map when checkbox is disabled.
    vm.addOrRemoveSat = function (enabled, satID){
        mapService.addOrRemoveSatellite(enabled, satID)
    }
}


