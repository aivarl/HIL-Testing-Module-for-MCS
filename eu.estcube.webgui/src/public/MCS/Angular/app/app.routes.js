angular
    .module('MCS')
    .config(config);

function config($routeProvider)  {
    $routeProvider
        .when('/test', {
            templateUrl: 'app/components/test/testView.html',
            controller: 'TestController',
            controllerAs: 'test'
            //controllerAs: 'test'
        })
        .when('/map', {
            templateUrl: 'app/components/map/mapView.html',
            controller: 'MapController',
            controllerAs: 'map'
        })
        .when('/system/components', {
            templateUrl: 'app/components/system/systemComponentsView.html',
            controller: 'SystemComponentsController',
            controllerAs: 'system'
        })
        .when('/script/editor', {
            templateUrl: 'app/components/scripteditor/scriptEditorView.html',
            controller: 'ScriptEditorController',
            controllerAs: 'scripteditor'
        })
        .when('/hardware/testing', {
            templateUrl: 'app/components/hardwaretesting/hardwareTestingView.html',
            controller: 'HardwareTestingController',
            controllerAs: 'hardwaretesting'
        })
        .when('/gs/TNC', {
            templateUrl: 'app/components/groundstation/TNCView.html',
            controller: 'TNCController',
            controllerAs: 'tnc'
        })
        .when('/ol3', {
            templateUrl: 'app/components/map/ol3View.html',
            controller: 'MapController',
            controllerAs: 'ol3'
        })
    $routeProvider.otherwise({redirectTo: '/'});
};