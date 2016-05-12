/**
 * Directive for dynamic window height. Currently used for map.
 */

// Add directive to module.
angular.module('MCS').directive('resize', resizeDirective);

// Directive.
function resizeDirective($window) {
    return {
        scope: {},
        link: function(scope, elem, attrs) {
            scope.onResize = function() {
                var padding = 30,
                    offset = elem.prop('offsetTop'),
                    height = $window.innerHeight - offset - padding;

                elem.css({height: height + 'px'});
            }
            scope.onResize();

            angular.element($window).bind('resize', function() {
                scope.onResize();
            })
        }
    }
}