/**
 * A geo calculations library created by Johan KŸtt
 * Based significantly on the formulas and scripts provided by http://www.movable-type.co.uk/
 */

var JKGeoLib = {};
JKGeoLib.EARTH_EQUATORIAL_RADIUS = 6378.13649; // in km
JKGeoLib.EARTH_POLAR_RADIUS = 6356.7523; // in km
JKGeoLib.EARTH_RADIUS = 6371.0; // average radius for spherical Earth in km


/* =============== GeoPoint Class =============== */

/**
 * A point representing a geographical location
 * Constructor:
 *    No arguments returns point at 0N 0E 0 altitude
 *    2 arguments returns point at <lat> <lon> 0 altitude
 *    3 arguments returns point at <lat> <lon> <alt>
 *
 *    Units are deg, deg, m
 */
JKGeoLib.GeoPoint = function() {
	this.lat = 0.0;
	this.lon = 0.0;
	this.alt = 0.0;

	// Check number of arguments and assign values
	if(arguments.length == 2) {
		this.lat = arguments[0];
		this.lon = arguments[1];
	}
	else if(arguments.length == 3) {
		this.lat = arguments[0];
		this.lon = arguments[1];
		this.alt = arguments[2];
	}
	else if(arguments.length != 0) {
		throw new JKGeoLib.Exception("Invalid number of arguments: " + arguments.length, this);
	}

	// Check for invalid values
	if(isNaN(this.lat) || this.lat > 90.0 || this.lat < -90.0)
		throw new JKGeoLib.Exception("Invalid latitude: " + this.lat, this);

	if(isNaN(this.lon))
		throw new JKGeoLib.Exception("Invalid longitude: " + this.lon, this);

	if(isNaN(this.alt) || this.alt < 0.0)
		throw new JKGeoLib.Exception("Invalid altitude: " + this.alt, this);

	// Normalise longitude
	while( this.lon > 180 ) this.lon -= 360.0;
	while( this.lon < -180 ) this.lon += 360.0;
};


/**
 * Calculates the point at a given bearing and distance
 * from the source point
 *
 * @param brg The initial true track of the great circle in deg
 * @param dist The distance to target point in km
 * @returns {JKGeoLib.GeoPoint}
 */
JKGeoLib.GeoPoint.prototype.pointAtBearingDist = function(brg, dist) {
	// http://www.movable-type.co.uk/scripts/latlong.html

	if( arguments.length < 2 )
		throw new JKGeoLib.Exception("Too few arguments.", this);
	else if(isNaN(brg))
		throw new JKGeoLib.Exception("Invalid bearing: " + brg, this);
	else if(isNaN(dist))
		throw new JKGeoLib.Exception("Invalid distance: " + dist, this);

	var bearing = deg2rad(brg);
	var start_lat_rad = deg2rad(this.lat);
	var start_lon_rad = deg2rad(this.lon);
	var arc = dist / JKGeoLib.EARTH_RADIUS;
	var end_lat_rad = Math.asin( Math.sin(start_lat_rad)*Math.cos(arc) + Math.cos(start_lat_rad)*Math.sin(arc)*Math.cos(bearing) );
	var end_lon_rad = start_lon_rad + Math.atan2( Math.sin(bearing)*Math.sin(arc)*Math.cos(start_lat_rad),Math.cos(arc)-Math.sin(start_lat_rad)*Math.sin(end_lat_rad));
	end_lon_rad = (end_lon_rad+Math.PI)%(2*Math.PI) - Math.PI; // normalise to -180...+180
	return new JKGeoLib.GeoPoint( rad2deg(end_lat_rad), rad2deg(end_lon_rad) );
};


/**
 * Calculates the surface distance
 * from the subpoint of the Point to the horizon
 * Assumes a spherical Earth with radius JKGeoLib.EARTH_RADIUS
 *
 * @returns {Number} The distance to the horizon
 */
JKGeoLib.GeoPoint.prototype.horizonSurfaceDistance = function() {
	var pointRadius = JKGeoLib.EARTH_RADIUS + this.alt / 1000.0;// dist from Earth centre to point
	var arc = Math.acos(JKGeoLib.EARTH_RADIUS / pointRadius);	// horizon distance in radians
	return arc * JKGeoLib.EARTH_RADIUS;
};


/**
 * Checks weather the longitude needs to be wrapped
 * Between the two points
 *
 * @param otherPoint JKGeoLib.GeoPoint to compare with
 * returns {bool} True if there is a wrap from -180 to +180 degrees
 */
JKGeoLib.GeoPoint.prototype.isWrap = function(otherPoint) {
	if( Math.abs(this.lon - otherPoint.lon) > 180.0 )
		return true;
	else
		return false;
};


/**
 * Rounds the members of the point to given accuracy
 * @param latAcc Latitude accuracy
 * @param lonAcc Longitude accuracy
 * @param altAcc Altitude accuracy
 */
JKGeoLib.GeoPoint.prototype.round = function(latAcc, lonAcc, altAcc) {
	this.lat = round2(this.lat / latAcc) * latAcc;
	this.lon = round2(this.lon / lonAcc) * lonAcc;
	this.alt = round2(this.alt / altAcc) * altAcc;
};

/* ================ End GeoPoint ================ */



/* =============== Exception Class =============== */

/**
 * Custom Exception for the JKGeoLib package
 * @param message The description to include with the exception
 * @param source The object that created the Exception
 */

JKGeoLib.Exception = function(message, source) {
	this.message = message;
	this.source = source;
};

/* ================ End Exception ================ */


/* ============== Utility functions ============== */

// Convert degrees to radians
if( typeof(deg2rad) == 'undefined' ) {
	deg2rad = function(a) {
		return a * Math.PI / 180.0;
	};
}

// Convert radians to degrees
if( typeof(rad2deg) == 'undefined' ) {
	rad2deg = function(a) {
		return a * 180.0 / Math.PI;
	};
}

// Round with given accuracy
if( typeof(round2) == 'undefined' ) {
	round2 = function(x, accuracy) {
		return Math.round(x / accuracy) * accuracy;
	};
}

// Convert degrees,minutes,seconds to degrees
// For negative angles, all members must be negative
if( typeof(dms2deg) == 'undefined' ) {
	dms2deg = function(d,m,s) {
		return d + m/60.0 + s/3600.0;
	};
}
