/**
 * Http service. Gets ground station, satellite and orbital state info from store.
 */
// Add service to module.
angular
    .module('MCS')
    .service('httpService', httpService);

function httpService(CONFIG, $http){
    
    // Should be temporary.
    var path = '../..';

    this.getGroundStations = function() {
        return $http.get(path + CONFIG.URL_CATALOGUE_GROUND_STATIONS, { cache: true}).success(function(data) {
            console.log("[$http] Getting ground stations.");
            return data;
        });
    }

    this.getSatellites = function() {
        return $http.get(path + CONFIG.URL_CATALOGUE_SATELLITES, { cache: true}).success(function(data) {
            console.log("[$http] Getting satellites.");
            return data;
        });
    }

    this.getOrbitalStates = function(satelliteID){
        return $http.get(path + CONFIG.URL_CATALOGUE_ORBITAL_STATES + this.IDEncoder(satelliteID)).success(function(data) {
            console.log("[$http] Getting orbital states for " + satelliteID + ".");
            return data;
        });
    };


    // common/net/IDEncoder.js - Replaces '/' with '_'.
    this.IDEncoder = function(id){
        return id.replace(/(_+)/g, "_$1").replace(/\//g, "_");
    };

}