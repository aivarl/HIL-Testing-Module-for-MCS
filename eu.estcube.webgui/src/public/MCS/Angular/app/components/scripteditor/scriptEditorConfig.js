/**
 * System components configuration.
 */
// Add constant to module.
angular
    .module('MCS')
    .constant("SCRPTEDITOR", {
        SCRIPT_EDITOR: {
            SOMETHING_AS_PARAMETER: "Some configurable value",
        }
    })