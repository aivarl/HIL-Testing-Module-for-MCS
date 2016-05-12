/**
 * System components configuration.
 */
// Add constant to module.
angular
    .module('MCS')
    .constant("HRDWRTESTING", {
        HARDWARE_TESTING: {
            SOMETHING_AS_PARAMETER: "Some configurable value",
        }
    })