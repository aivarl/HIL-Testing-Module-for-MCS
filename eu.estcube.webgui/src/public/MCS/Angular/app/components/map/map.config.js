/**
 * Map configuration.
 */
// Add constant to module.
angular
    .module('MCS')
    .constant("MAP", {
        updateInterval: 10,
        radioCoverageBoundaryStepSize: 9, // The step size to draw the
                                            // radio coverage area in
                                            // degrees
        // Must be a divisor of 360.
        // Otherwise artifacts will occur at longitude 180E/W
        
        styles: {
            gsLayer: {
                'default': {
                    strokeOpacity: 1,
                    strokeWidth: 2,
                    fillColor: "#FFFF00",
                    fillOpacity: 0.5,
                    pointRadius: 4,
                    strokeColor: "#000000",
                    cursor: "pointer",
                    label : "${label}",
                    fontSize: "12px",
                    fontFamily: "Courier New, monospace",
                    fontColor : "#FFFF00",
                    labelYOffset: -16
                },
                'select': {
                    strokeOpacity: 1,
                    strokeWidth: 2,
                    fillColor: "#FFA500",
                    fillOpacity: 0.5,
                    pointRadius: 4,
                    strokeColor: "#000000",
                    cursor: "pointer"
                }
            },
            
            satLocationLayer: {
                'default': {
                    strokeOpacity: 1,
                    strokeWidth: 2,
                    fillColor: "#FFFFFF",
                    fillOpacity: 0.7,
                    pointRadius: 12,
                    strokeColor: "#000000",
                    cursor: "pointer",
                    label : "${label}",
                    fontSize: "16px",
                    fontFamily: "Courier New, monospace",
                    fontColor : "#FFFFFF",
                    labelYOffset: -20,
                    externalGraphic: "/images/logo-final.png"
                },
                'select': {
                    strokeOpacity: 1,
                    strokeWidth: 2,
                    fillColor: "#FFFF00",
                    fillOpacity: 0.5,
                    pointRadius: 10,
                    strokeColor: "#000000",
                    cursor: "pointer",
                    label : "${label}",
                    fontSize: "16px",
                    fontFamily: "Courier New, monospace",
                    fontColor : "#FF0000",
                    labelYOffset: -20
                }
            },
            
            orbitColorInSunlight: "#FF0000",
            orbitColorNotInSunlight: "#A00000",
            
            orbitalTraceLayer: {
                'default': {
                    strokeColor: "${orbitColor}",
                    strokeWidth: 2,
                    fillColor: "#FFFFFF",
                    pointRadius: 3
                }
            },
            
            traceArrowLayer: {
                'default': {
                    strokeColor: "#FF0000",
                    strokeWidth: 2,
                    fillColor: "#FFFFFF",
                    graphicName: "triangle",
                    pointRadius: 5,
                    rotation: "${angle}"
                }
            },
            
            radioCoverageLayer: {
                'default': {
                    strokeColor: "#00AA00",
                    strokeWidth: 2,
                    strokeOpacity: 0.5,
                    fillColor: "#AA1111",
                    fillOpacity: 0.2,
                }
            }
        }
    })