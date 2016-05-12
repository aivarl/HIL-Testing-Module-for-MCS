define(['dojo/domReady!'], function() {
    return {
        routes: {
            CONTACTPLANNING: {
                path: 'system/contactplanning',
                defaults: {
                    controller: 'ContactPlanning/ContactPlanningController',
                    method: 'index',
                    destroyMethod: 'clear'
                }
            }
        },
        
        CONTACTPLANNING: {
            updateInterval: 1000 * 60 * 10,
            timeRange: [0, +12],
            
            contactBoxHeight: 20,
            spacing: 20,
            groundStationHeadingHeight: 20,
            
            timelineHeight: 50,
            timelineHourMarkerHeight: 20,
            timelineHalfHourMarkerHeight: 10,
            
            colors: ['#FF0000', '#8000FF', '#009100'],
            timeSelectorColor: 'blue',
            
            orbitNumberTextOffset: 5,
            satelliteLabelOffset: 5,
            
            timeLabelX: 20,
            timeLabelYOffset: 20
        }
    }
});