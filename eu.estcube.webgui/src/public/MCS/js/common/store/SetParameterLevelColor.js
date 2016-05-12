define([],

    function() {
        return function(parameter, node) {
            var level = parameter.level;
            if (level != undefined) {
            	//colors editable in css file
                node.className += " parameter-level-" + level;
            }
        }
    }
);