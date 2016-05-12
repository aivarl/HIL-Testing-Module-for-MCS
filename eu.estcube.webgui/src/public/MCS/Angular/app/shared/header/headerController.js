/**
 * Controller for getting navigation bar (header) links from header.json.
 */

// Add controller to module.
angular
    .module('MCS')
    .controller('HeaderController', HeaderController);

// Controller.
function HeaderController($http,$location) {
    var vm = this;

    $http.get('app/shared/header/header.json').success(function(data) {
        vm.menu = data;
    });
    
    vm.isActive = function(route) {
        return route === $location.path();
    }
}