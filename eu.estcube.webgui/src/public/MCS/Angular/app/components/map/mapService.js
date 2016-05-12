/**
 * Map service. Includes function to create the map.
 */
// Add service to module.
angular
    .module('MCS')
    .service('mapService', mapService);

// Dependencies: httpService for getting orbital states; MAP for configuration.
function mapService(httpService, MAP) {
    

    // Remove ground station with checkbox.
    this.addOrRemoveGroundStation = function(enabled, gsID){
        if(enabled){
            this.gsLayer.addFeatures([this.gsFeatures[gsID]]);
        } else{
            this.gsLayer.removeFeatures([this.gsFeatures[gsID]]);
        }
    }

    // Remove satellite with checkbox. TODO stop trying to add/remove a satellite that's not drawn on map (ESTCube-lab, causes TypeError).
    this.addOrRemoveSatellite = function(enabled, id){
        if (this.satellitesTracked[id].feature == null)
            return;
        console.log(enabled, "and", id, "sat")
        this.satellitesTracked[id].showing = enabled;

        var trace = [];
        this.traceFeatures[id].forEach(function(segment, index){
            trace.push(segment.feature);
        })

        var arrows = [];
        this.traceFeatures[id].forEach(function(segment, index){
            arrows.push(segment.arrowFeature);
        })

        var radioCoverage = this.radioCoverageFeatures[id];
        if(enabled) {
            this.satLocationLayer.addFeatures([this.satellitesTracked[id].feature]);
            this.orbitalTraceLayer.addFeatures(trace);
            this.traceArrowLayer.addFeatures(arrows);
            //this.radioCoverageLayer.addFeatures(radioCoverage); ADDING OF RADIO COVERAGE IS DONE IN FeatureUpdate
        } else {
            this.satLocationLayer.removeFeatures([this.satellitesTracked[id].feature]);
            this.orbitalTraceLayer.removeFeatures(trace);
            this.traceArrowLayer.removeFeatures(arrows);
            this.radioCoverageLayer.removeFeatures(radioCoverage); // Just in case something got left over
        }
    }


    this.createMap = function(groundStationz, satellitez) {

        function toDegrees(rad) {
            return rad * (180 / Math.PI);
        }
        
        var visible = true; //TESTME was originally false, testing with true

        this.setVisible = function(vis) {
            visible = vis;
        }

        this.isVisible = function() {
            return visible;
        }
        
        var map = new OpenLayers.Map('map',{
            resolutions: [0.17578125,0.087890625],
            controls: [
                       new OpenLayers.Control.Navigation({ zoomWheelEnabled: true }),
                       new OpenLayers.Control.PanZoomBar(),
                       new OpenLayers.Control.ScaleLine(),
                       new OpenLayers.Control.MousePosition(),
                       new OpenLayers.Control.KeyboardDefaults()
                       ],
            numZoomLevels: 2,
        });
        
        var renderer = OpenLayers.Layer.Vector.prototype.renderers;
        
        var mainLayer = new OpenLayers.Layer.WMS("Global Imagery",
                "http://maps.opengeo.org/geowebcache/service/wms",
                { layers: "bluemarble" },
                { tileOrigin: new OpenLayers.LonLat(-180, -90) }
        );
        
        
        var groundStationLocationLayer = new OpenLayers.Layer.Vector("Ground Station Location Geometry Layer", {
            styleMap: new OpenLayers.StyleMap(MAP.styles.gsLayer),
            // rendereres: renderer
        });
        
        this.gsLayer = groundStationLocationLayer;

        var satelliteLocationLayer = new OpenLayers.Layer.Vector("Satellite Location Prediction Layer", {
            styleMap: new OpenLayers.StyleMap(MAP.styles.satLocationLayer),
            // renderers : renderer
        });

        this.satLocationLayer = satelliteLocationLayer;

        var orbitalTraceLayer = new OpenLayers.Layer.Vector("Orbital Trace Layer", {
           styleMap: new OpenLayers.StyleMap(MAP.styles.orbitalTraceLayer),
           // renderers: renderer
        });

        this.orbitalTraceLayer = orbitalTraceLayer;

        var traceArrowLayer = new OpenLayers.Layer.Vector("Orbital Trace Direction Arrows Layer", {
           styleMap: new OpenLayers.StyleMap(MAP.styles.traceArrowLayer),
           // renderes: renderer
        });
        this.traceArrowLayer = traceArrowLayer;

        // layer to draw the radio coverage areas of the satellites
        var radioCoverageLayer = new OpenLayers.Layer.Vector("Radio Coverage Layer", {
            styleMap: new OpenLayers.StyleMap(MAP.styles.radioCoverageLayer)
        });
        this.radioCoverageLayer = radioCoverageLayer;

        var control = new OpenLayers.Control.SelectFeature(satelliteLocationLayer, {
            multiple: false,
            toggle: true
        });

        map.addControl(control);

        var satPopup = null;
        satelliteLocationLayer.events.on({
            "featureselected": function(element) {
                // TODO: If another feature is selected, does "unselected" event
                // fire first?
                satPopup = new OpenLayers.Popup("Satellite popup",
                        new OpenLayers.LonLat(element.feature.geometry.x, element.feature.geometry.y),
                        new OpenLayers.Size(200, 200), element.feature.attributes.label, true,
                        function() { control.unselect(element.feature) });
                map.addPopup(satPopup);
            },

            "featureunselected": function(element) {
                satPopup.destroy();
            }
        });

        control.activate();

        map.addLayer(mainLayer);
        map.addLayer(this.radioCoverageLayer);
        map.addLayer(groundStationLocationLayer);
        map.addLayer(orbitalTraceLayer);
        map.addLayer(traceArrowLayer);
        map.addLayer(satelliteLocationLayer);


        // Actual logic starts here.
        
        this.gsFeatures = {};      // GS id => map feature for GS
        this.groundStations = [];
        
        
        // Adding ground stations.
        for (gs of groundStationz){
            var feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(gs.geoLocation.longitude, gs.geoLocation.latitude));
            feature.attributes = { label : gs.name };

            this.gsFeatures[gs.ID] = feature;

            this.addOrRemoveGroundStation(true, gs.ID);
            this.groundStations.push(gs);
        };
 
     // Inserts <x> to <arr> at position <n> inplace, shifting tail
        function InsertIntoArray(arr, x, n) {
            for(var i = arr.length; i > n; i--) {
                arr[i] = arr[i-1];
            }

            arr[n] = x;
        }

        // id => {showing, pos = {lat, long, timestamp}, nextPos = {lat, long,
        // timestamp}, feature},
        // showing: boolean - Do we show features related to this sat on the map
        // pos - Last known position of the sat
        // nextPos - Next known position
        // feature - Map feature (for satelliteLocationLayer)
        var satellitesTracked = {};
        var traceFeatures = {};
        var radioCoverageFeatures = [];
        this.satellites = [];
        this.satellitesTracked = satellitesTracked;
        this.traceFeatures = traceFeatures;
        this.radioCoverageFeatures = radioCoverageFeatures;
        
        // Adding satellites.
        
        for (sat of satellitez){
            satellitesTracked[sat.ID] = {showing: true, pos: null, nextPos: null, feature: null};
            
            SetupUpdater(sat.ID, sat.name);

            console.log("[map] Tracking satellite ", sat.ID);

            if(this.satellites.indexOf(sat) == -1){
                this.satellites.push(sat);
            }
        };
        
        // // Main function. For a satellite with ID <satelliteId>, sets up tracking
        // structures and
        // // event listeners that will move the sat on the map according to the
        // received (possibly
        // // incomplete) data points.
        function SetupUpdater(satelliteId, satelliteName) {
            // Priority queue (PQ), where all the known future positions are
            // held, sorted
            // by timestamp. The next known position (NP) is not contained here,
            // but in
            // the <satellitesTracked[satelliteId]> field
            var futurePositions = [];

            // Extracts needed data from the message in the store
            function MessageToPosition(msg) {
                return {
                    lat: msg.geoLocation.latitude,
                    lon: msg.geoLocation.longitude,
                    alt: msg.geoLocation.altitude,
                    timestamp: msg.timestamp,
                    inSunlight: true // TODO: Get from <msg> when available
               };
            }

            // Processes received message. Preserves invariant:
            // LKP.timestamp < Date.now() < NKP.timestamp <
            // futurePositions[0].timestamp
            //
            function ProcessMessage(message) {
                
                msg = MessageToPosition(message);

                var x = msg.timestamp
                var trackingData = satellitesTracked[satelliteId];

                var now = Date.now();

                if(trackingData.pos != null) { // If we already have some known
                                                // location in past/present
                    if(msg.timestamp > trackingData.pos.timestamp) {
                        if(msg.timestamp > now) {

                            if(trackingData.nextPos != null && msg.timestamp > trackingData.nextPos.timestamp) { // Future
                                                                                                                    // point
                                                                                                                    // after
                                                                                                                    // NP
                                // Place <msg> in PQ <futurePositions>
                                var index;
                                for(index = 0; index < futurePositions.length && futurePositions[index].timestamp < msg.timestamp; index++);
                                InsertIntoArray(futurePositions, msg, index);
                            } else {

                                // Point between LKP and NP - must become new NP

                                // Put old NP into PQ
                                if(trackingData.nextPos != null) {
                                    futurePositions.unshift(trackingData.nextPos);
                                }

                                // Set NP to <msg>
                                trackingData.nextPos = msg;
                                // Recalculate interpolation
                                UpdateInterpolation();
                            }
                        } else {
                            // Update last known position and interpolation
                            UpdateLastKnownPosition(msg);
                        }
                    }
                } else { // Have received no suitable LKP candidates yet
                    // TODO: noticed the bug too late, this is the easiest way
                    // to fix, but there should be a way to refactor it later

                    if(msg.timestamp > now) {
                        // Message is in future - can't set is as LKP, just add
                        // it to the PQ
                        var index;
                        for(index = 0; index < futurePositions.length && futurePositions[index].timestamp < msg.timestamp; index++);
                        InsertIntoArray(futurePositions, msg, index);
                    } else {
                        // Setup initial LKP and map feature
                        trackingData.pos = {lon: msg.lon, lat: msg.lat, alt: msg.alt, timestamp: msg.timestamp};
                        trackingData.nextPos = null;

                        var point = new OpenLayers.Geometry.Point(msg.lon, msg.lat)
                        trackingData.feature = new OpenLayers.Feature.Vector(point);
                        trackingData.feature.alt = msg.alt;
                        trackingData.feature.attributes = { label: satelliteName }; // attributes
                                                                                    // can
                                                                                    // be
                                                                                    // reference
                                                                                    // by
                                                                                    // feature
                                                                                    // stylemap

                        satelliteLocationLayer.addFeatures([trackingData.feature]);

                        if(futurePositions.length > 0) { // If we already
                                                            // know some future
                                                            // points, set NP
                            UpdateNearestPoint();
                        }
                    }
                }
            }

            // Listen to data points for this sat
            this.orbitalStatez = httpService.getOrbitalStates(satelliteId);
            this.orbitalStatez.then(function(result) {
                this.orbitalStatez = result.data;
                for(orbitalState of orbitalStatez){
                    ProcessMessage(orbitalState);
                }
            });
            

            // Update linear position interpolation between LKP and NP
            function UpdateInterpolation() {

                var data = satellitesTracked[satelliteId];

                if(data.pos != null && data.nextPos != null) {
                    // If there is a map boundary between LKP and NP, do no
                    // interpolation. This is needed to avoid
                    // interpolating the position through the whole screen -
                    // engine knows nothing about the Earth being
                    // a spheroid. In future, proper solution would be to add
                    // fictive point on the edges on both LKP
                    // and NP sides so the interpolation could continue.
                    if(!IsWrap(data.pos, data.nextPos)) {
                        var lerpCoeff = (Date.now() - data.pos.timestamp) / (data.nextPos.timestamp - data.pos.timestamp);

                        if(lerpCoeff > 1) {
                            console.error("[map] UpdateInterpolation: lerp coefficient > 1");
                        }

                        data.feature.geometry.x = data.pos.lon + lerpCoeff * (data.nextPos.lon - data.pos.lon);
                        data.feature.geometry.y = data.pos.lat + lerpCoeff * (data.nextPos.lat - data.pos.lat);
                        data.feature.geometry.alt = data.pos.alt + lerpCoeff * (data.nextPos.alt - data.pos.alt);

                        // TODO: The UpdateFeature function shouldn't need any
                        // input arguments
                        // as the feature already contains updated coordinates

                        // Move the feature on the map
                        UpdateFeature(data.feature.geometry.x, data.feature.geometry.y, data.feature.geometry.alt);
                    }
                }
            }

            // Set LKP
            // If NP is not null
            // If NP.timestamp < LKP.timestamp
            // Update NP
            // Else:
            // Recalculate interpolation (case: LKP changed)
            function UpdateLastKnownPosition(lkp) {

                var data = satellitesTracked[satelliteId];

                var oldPos = data.pos;

                data.pos = {
                    lat: lkp.lat,
                    lon: lkp.lon,
                    alt: lkp.alt,
                    timestamp: lkp.timestamp
                };

                data.feature.geometry.x = lkp.lon;
                data.feature.geometry.y = lkp.lat;
                data.feature.geometry.alt = lkp.alt;

                if(oldPos != null && data.nextPos != null && data.nextPos ) {
                    if(data.nextPos.timestamp <= lkp.timestamp) {
                        UpdateNearestPoint();
                    }
                }

                UpdateInterpolation();

                // TODO: DRY
                if(satellitesTracked[satelliteId].showing && visible) {
                    satelliteLocationLayer.redraw();
                    radioCoverageLayer.redraw();
                }
            }

            // NB: Assumes that NP needs to be switched (checks are on caller
            // site)
            // Switches NP to the next one in line (if it is available)
            function UpdateNearestPoint() {
                var data = satellitesTracked[satelliteId]; // TODO: Just move
                                                            // it one level up,
                                                            // everybody uses it

                if(futurePositions.length > 0) {
                    var nearest = futurePositions.shift();

                    data.nextPos = nearest;
                } else {
                    data.nextPos = null;
                }
            }

            function GetSign(x) {
                return x > 0 ? 1 : (x < 0 ? -1 : 0);
            }

            function IsWrap(pos1, pos2) {
                var lonDistance = Math.abs(pos1.lon - pos2.lon);

                if(lonDistance > 180)
                    return true;

                var latDistance = Math.abs(pos1.lat - pos2.lat);

                if(latDistance > 90)
                    return true;

                return false;
            }

            function Point(lat, lon, timestamp) {
                this.lat = lat;
                this.lon = lon;
                this.timestamp = timestamp;
            }

            function UpdateFeature(x, y) {
                var data = satellitesTracked[satelliteId];

                data.feature.geometry.x = x;
                data.feature.geometry.y = y;
                data.feature.geometry.clearBounds();

                // TODO: Look into updating the existing radio coverge feature
                // instead of creating a new one every single time
                radioCoverageLayer.removeFeatures( radioCoverageFeatures[satelliteId] );

                if(satellitesTracked[satelliteId].showing && visible) {
                    radioCoverageFeatures[satelliteId] = createRadioCoverageFeature(
                            data.feature.geometry.y,
                            data.feature.geometry.x,
                            data.feature.geometry.alt );
                    radioCoverageLayer.addFeatures( radioCoverageFeatures[satelliteId] );

                    satelliteLocationLayer.redraw();
                    radioCoverageLayer.redraw();
                }
            }

            // Creates an orbital trace
            function CreateTrace() {
                // Class - continuous segment of the trace, without map wraps or
                // inSunlight state changes
                //
                // Constructor is one big sideeffect - adds a corresponding
                // feature to the layer
                function Segment(segmentPoints, inSunlight) {
                    this.earliest = segmentPoints[0];
                    this.latest = segmentPoints[segmentPoints.length - 1];
                    this.points = segmentPoints;

                    // Create multiline feature for the segment
                    var openLayersPoints = [];
                    this.points.forEach(function (point, index) {
                        openLayersPoints.push(new OpenLayers.Geometry.Point(point.lon, point.lat));
                    });
                    var geometry = new OpenLayers.Geometry.LineString(openLayersPoints);


                    this.feature = new OpenLayers.Feature.Vector(geometry, {
                        orbitColor: (inSunlight ? MAP.styles.orbitColorInSunlight : MAP.styles.orbitColorNotInSunlight)
                    });

                    // Add arrow to the end
                    var p1 = segmentPoints[segmentPoints.length - 2];
                    var p2 = this.latest;
                    var dx = p2.lon - p1.lon;
                    var dy = p2.lat - p1.lat;

                    var angle = -toDegrees(Math.acos(dy / Math.sqrt(dx * dx + dy * dy)));

                    this.arrowFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(p2.lon, p2.lat), {
                        angle: angle
                    });

                    // Add the feature to the
                    orbitalTraceLayer.addFeatures([this.feature]);
                    traceArrowLayer.addFeatures([this.arrowFeature]);

                    if(visible) {
                        orbitalTraceLayer.redraw();
                        traceArrowLayer.redraw();
                    }
                }

                function IsLightChange(p1, p2) {
                    return p1.inSunlight != p2.inSunlight;
                }

                // Splits the points into the biggest possible segments. Split
                // points
                // are on map wraps and sunlight changes.
                function CreateInitialSegments(points) {
                    var segments = [];

                    var previousSplit = 0;

                    for(var i = 1; i < points.length; i++) {
                        var lightChange = IsLightChange(points[i-1], points[i]);
                        var wrap = IsWrap(points[i-1], points[i]);

                        if(lightChange || wrap) {
                            // Split. If the split is due to sunlight change,
                            // add and extra point to
                            // preserve the visible continuity of the trace
                            var newSegmentPoints = points.slice(previousSplit, wrap ? i : (i + 1));
                            
                            if(newSegmentPoints.length > 1) {
                                segments.push(new Segment(newSegmentPoints, points[i-1].inSunlight));
                            }

                            previousSplit = i;
                        }
                    }

                    if(points.length - previousSplit > 1) {
                        segments.push(new Segment(points.slice(previousSplit, points.length), true));
                    }

                    return segments;
                }

                console.log("[map] Creating trace for satellite ", satelliteId);

                // Delete old trace
                var oldTraceFeatures = [];
                traceFeatures[satelliteId].forEach(function (segment, index) {
                    oldTraceFeatures.push(segment.feature);
                });
                orbitalTraceLayer.destroyFeatures(oldTraceFeatures);

                // Create a new one
                // Need to query orbitalStateStore with angular.
                var points = httpService.getOrbitalStates(satelliteId);
                points.then(function(result) {
                    points = result.data;
                    points.sort(function(a, b){
                        return a.timestamp-b.timestamp
                       })

                    this.initialSegmentPoints = [];
                    points.forEach(function (p, index){
                        this.initialSegmentPoints.push(MessageToPosition(p));
                    })
                    var segments = CreateInitialSegments(initialSegmentPoints);
                    
                    traceFeatures[satelliteId] = segments;
                });
                
            }


            // Create OpenLayers Feature for radio coverage area
            function createRadioCoverageFeature(lat, lon, alt) {
                var srcPoint = new JKGeoLib.GeoPoint(lat, lon, alt);
                // srcPoint.lat = -62; srcPoint.lon = -170; srcPoint.alt =
                // 1000*1000;
                var radius = srcPoint.horizonSurfaceDistance();
                var boundaryPoints = [];

                // TODO: Add solution for the cases
                // when the source point is exactly 90N/S 180E/W
                // when the source point is <-87.1 / -180

                // TODO: Split a wrapped area into two separate features

                // TODO: Improve wrap point latitude accuracy.
                // At the moment it's only a straight average of neighbouring
                // points

                for(i = 0; i <= 360; i += MAP.radioCoverageBoundaryStepSize) {
                    var newPoint = srcPoint.pointAtBearingDist(i, radius);

                    // Check for 180/-180 longitude wrapping
                    // and create additional points for correct drawing if
                    // needed
                    if( i > 0 && IsWrap( boundaryPoints[boundaryPoints.length-1], newPoint ) ) {
                        if(srcPoint.lat >= 0) {
                            var tempLat = 90;
                        }
                        else {
                            var tempLat = -90;
                        }
                        var prevPoint = boundaryPoints[boundaryPoints.length-1];
                        var avgLat = (prevPoint.lat + newPoint.lat) / 2.0;
                        if(prevPoint.lon >= 0) {
                            boundaryPoints.push( new JKGeoLib.GeoPoint(avgLat,180) );
                            boundaryPoints.push( new JKGeoLib.GeoPoint(tempLat,180) );
                            boundaryPoints.push( new JKGeoLib.GeoPoint(tempLat,-180) );
                            boundaryPoints.push( new JKGeoLib.GeoPoint(avgLat,-180) );
                        }
                           else {
                               boundaryPoints.push( new JKGeoLib.GeoPoint(avgLat,-180) );
                               boundaryPoints.push( new JKGeoLib.GeoPoint(tempLat,-180) );
                               boundaryPoints.push( new JKGeoLib.GeoPoint(tempLat,180) );
                               boundaryPoints.push( new JKGeoLib.GeoPoint(avgLat,180) );
                           }
                    }

                    // Add the new point to the end of the array
                    boundaryPoints.push( newPoint );
                }

                // Convert points to OpenLayers and add to the feature
                var areaBoundary = new OpenLayers.Geometry.LinearRing();
                boundaryPoints.forEach(function (item, index) {
                    areaBoundary.addComponent( new OpenLayers.Geometry.Point(item.lon, item.lat) );
                });
                
//                Arrays.map(boundaryPoints, function(item) {
//                    areaBoundary.addComponent( new OpenLayers.Geometry.Point(item.lon, item.lat) );
//                });
                return new OpenLayers.Feature.Vector( areaBoundary );
            }
            // END createRadioCoverageFeature


            traceFeatures[satelliteId] = [];
            // For each batch update to the store, recreate the trace. This is
            // easier than
            // trying to maintain the trace structure with each new data point
            // arrival
//            OrbitalStateStore.onUpdate(CreateTrace); //TODO Implement.
            CreateTrace();

            // Main updater. Updates interpolation and sets NP
            // as new LKP when needed
            var updater = setInterval(function() {
                var data = satellitesTracked[satelliteId];
                if(data.nextPos !== null) {
                    var now = Date.now();
                    if(now < data.nextPos.timestamp) {
                        UpdateInterpolation();
                    } else {
                        // Update LKP, NP
                        UpdateLastKnownPosition(data.nextPos);
                    }
                }
            }, MAP.updateInterval);
        };

         destroy = function() {
             this.setVisible(false);
         }
        
        
        this.setVisible(true);
        // Needed to initialize map.
        map.zoomToExtent(map.getMaxExtent(), true);
        map.setOptions({
            restrictedExtent: map.getMaxExtent()
        });
//        map.zoomToMaxExtent();
        return map;
    
    };
}
