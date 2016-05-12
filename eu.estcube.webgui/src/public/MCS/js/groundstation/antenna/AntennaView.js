function dump(o) {
  var s = "";
  for(p in o) {
    s += p + "=" + o[p] + "; ";
  }
  return s;
}
function logGlError(gl) {
  var err = gl.NO_ERROR;
  do {
    var err = gl.getError();
    if (err != gl.NO_ERROR) {
      console.log("gl error " + err);
    }
  } while (err != gl.NO_ERROR);
}
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/on",
    "dijit/layout/ContentPane",
    "dojo/mouse",
    "config/config",
    "ThreeJS"
  ],

  function(Declare, DomConstr, On, ContentPane, Mouse, Config, Three) {
   
    var scene;
    var gl;
    var openglsupported;
    var isMouseDown = false,
      startX = null,
      startY = null,
      deltaX = 0,
      deltaY = 0,
      angleX = 0.0,
      angleY = 0.0;
    var camXElem;
    var camYElem;
    var antXElem;
    var antYElem;
    var camera;
    var camBase;
    var radius = 1.5;
    var circleMesh;
    var dashMesh;
    var standHeight = 1.5;
    var standMesh;
    var antMesh;
    var skyMesh;
    var gndMesh;
    var nMesh;
	var boxMesh;
    var calcDeltas = function(x, y) {
      deltaX = (null == startX) ? 0 : (x - startX);
      deltaY = (null == startY) ? 0 : (y - startY);
    };
    var enterMoveMode = function(x, y) {
      isMouseDown = true;
      calcDeltas(x, y);
      startX = x;
      startY = y;
    };
    var leaveMoveMode = function(x, y) {
      isMouseDown = false;
      calcDeltas(x, y);
      startX = null;
      startY = null;
    };
    var onMouseDown = function(e) {
      if (0 == e.button) {
        e.preventDefault();
        enterMoveMode(e.offsetX, e.offsetY);
      }
    };
    var calcRotations = function() {
      angleX += deltaY / 100.0;
      angleY += deltaX / 100.0;
    };
    var onMouseUp = function(e) {
      if (0 == e.button) {
        e.preventDefault();
        leaveMoveMode(e.offsetX, e.offsetY);
        calcRotations();
      }
    };
    var onMouseMove = function(e) {
      if (isMouseDown) {
        e.preventDefault();
        calcDeltas(e.offsetX, e.offsetY);
        startX = e.offsetX;
        startY = e.offsetY;
        calcRotations();
      }
    };
    var onMouseOut = function(e) { // mouse leaves element
      if (0 == e.button) {
        e.preventDefault();
        leaveMoveMode(e.offsetX, e.offsetY);
        calcRotations();
      }
    };
    
    var antRotAngle = 0.0; // antenna asimuth
    var antElevAngle = 0.0; // antenna elevation
    var antRotTarget = 0.0;
    var antElevTarget = 0.0;
    
    var update = function() {
      camBase.rotation.setX(angleX);
      camBase.rotation.setY(angleY);
      camXElem.innerHTML = "cameraX=" + (angleX * 180.0 / Math.PI);
      camYElem.innerHTML = "cameraY=" + (angleY * 180.0 / Math.PI);
      var dX = antRotTarget - antRotAngle;
      dX = Math.max(-Math.PI / 180.0, Math.min(Math.PI / 180.0, dX));
      antRotAngle += dX;
      standMesh.rotation.setZ(-antRotAngle);
      var dY = antElevTarget - antElevAngle;
      dY = Math.max(-Math.PI / 360.0, Math.min(Math.PI / 360.0, dY));
      antElevAngle += dY;
      antMesh.rotation.setX(-Math.PI / 2.0 + antElevAngle);
      antXElem.innerHTML = "Antenna Azimuth=" + (antRotAngle * 180.0 / Math.PI) +
        " Target Azimuth=" + (antRotTarget * 180.0 / Math.PI);
      antYElem.innerHTML = "Antenna Elevation=" + (antElevAngle * 180.0 / Math.PI) +
        " Target Elevation=" + (antElevTarget * 180.0 / Math.PI);
    };
    
    var animate = function() {
      requestAnimationFrame(animate);
      update();
      gl.render(scene, camera);
    };
    
    var setTarget = function() {
      var r = Math.random();
      antRotTarget = r * 2 * Math.PI;
      r = Math.random();
      antElevTarget = r * Math.PI / 2;
    };
    
    return Declare([], {

      constructor: function(args) {
        scene = new THREE.Scene();
        try {
        	gl = new THREE.WebGLRenderer({ antialias: true });
        	openglsupported = true;
        	angleX = -30.0 * Math.PI / 180.0;
        } catch (err){
  		  	console.log("No WebGL support, will use alternative renderer without fancy graphics");
  		  	openglsupported = false;
        	gl = new THREE.CanvasRenderer();
        	angleX = -90.0 * Math.PI / 180.0;
        }
        
        gl.setSize(Config.ANTENNA.canvasWidth, Config.ANTENNA.canvasHeight);
        
        camXElem = DomConstr.create("div");
        camXElem.innerHTML = "cameraX=0";
        camYElem = DomConstr.create("div");
        camYElem.innerHTML = "cameraY=0";
        antXElem = DomConstr.create("div");
        antXElem.innerHTML = "antennaX=0";
        antYElem = DomConstr.create("div");
        antYElem.innerHTML = "antennaY=0";
        
		//camera distance from camera
        var view_angle = 80,
          aspect_ratio = Config.ANTENNA.canvasWidth / Config.ANTENNA.canvasHeight,
		  //
          view_near = 1,
          view_far = 20;
        camera = new THREE.PerspectiveCamera(view_angle, aspect_ratio, view_near, view_far);
        
		
	
        camBase = new THREE.Object3D();
        //azimuth circle step
        var step = 10;
        var sectors = 360 / step;
        var circleGeom = new THREE.CircleGeometry(radius, sectors);
		
		
		var wireFrameTexture = THREE.ImageUtils.loadTexture( '/images/compass.png' );
		//azimuth color shape
        var wireframe2 = new THREE.MeshBasicMaterial({color: 0xC0C0C0,wireframe: false ,map: wireFrameTexture});
        circleMesh = new THREE.Mesh(circleGeom, wireframe2);
        
        var dashGeom = new THREE.Geometry();
        for (var i = 0 ; i < sectors; i++) {
          var deg = i * step;
          var rad = Math.PI * deg / 180.0;
          var x = radius * Math.cos(rad);
          var y = radius * Math.sin(rad);
          var d = (i % 2 == 0 ? 0.1 : 0.05);
          var r = 1.0 - d;
          dashGeom.vertices.push(new THREE.Vector3(x * r, y * r, 0.01));
          var r2 = 1.0 + d;
          dashGeom.vertices.push(new THREE.Vector3(x * r2, y * r2, 0.01));
        }
		
		
        
        var antLineW = 5;
        var standGeom = new THREE.Geometry();
        standGeom.vertices.push(new THREE.Vector3(0, radius - 0.3, 0.01));
        standGeom.vertices.push(new THREE.Vector3(0, 0, 0.01));
        standGeom.vertices.push(new THREE.Vector3(0, 0, standHeight));
		//antenna support pedestal
        var standMaterial = new THREE.LineDashedMaterial({ color: 0xFF0000 ,linewidth: antLineW});
        standMesh = new THREE.Line(standGeom, standMaterial);
        
		
		//antenna geometry defined using 3D vectors
        var antGeom = new THREE.Geometry();
        var lrDist = 1.0;
        var udDist = 1.0;
        var fDist = 2.0;
        var bDist = -1.0;
        antGeom.vertices.push(new THREE.Vector3(-lrDist, udDist, fDist)); // left up
        antGeom.vertices.push(new THREE.Vector3(-lrDist, udDist, bDist));
        antGeom.vertices.push(new THREE.Vector3(lrDist, udDist, fDist)); // right up
        antGeom.vertices.push(new THREE.Vector3(lrDist, udDist, bDist));
        antGeom.vertices.push(new THREE.Vector3(-lrDist, -udDist, fDist)); // left down
        antGeom.vertices.push(new THREE.Vector3(-lrDist, -udDist, bDist));
        antGeom.vertices.push(new THREE.Vector3(lrDist, -udDist, fDist)); // right down
        antGeom.vertices.push(new THREE.Vector3(lrDist, -udDist, bDist));
        antGeom.vertices.push(new THREE.Vector3(-lrDist, udDist, 0)); // left from up to down
        antGeom.vertices.push(new THREE.Vector3(-lrDist, -udDist, 0));
        antGeom.vertices.push(new THREE.Vector3(lrDist, udDist, 0)); // right from up to down
        antGeom.vertices.push(new THREE.Vector3(lrDist, -udDist, 0));
        antGeom.vertices.push(new THREE.Vector3(-lrDist, 0, 0)); // from left to right
        antGeom.vertices.push(new THREE.Vector3(lrDist, 0, 0));
        
        
        //Antenna carcas
        var antMaterial = new THREE.LineBasicMaterial({ color: 0x404040, linewidth:15 });
        antMesh = new THREE.Line(antGeom, antMaterial, THREE.LinePieces);
        
        // We don't want to run too fancy things on browsers without opengl
        if (openglsupported){
        	
        	//SKY
			var skyTexture = THREE.ImageUtils.loadTexture( '/images/sky.jpg' );
		    skyTexture .wrapS = THREE.RepeatWrapping;
			skyTexture .anisotropy = 1;					
	        var skyRadius = 10;
	        var skySegments = 100;
	        var skyGeom = new THREE.SphereGeometry(skyRadius, skySegments, 4, 0, 2 * Math.PI, 0, Math.PI / 2);
	        var skyMaterial = new THREE.MeshBasicMaterial({  side: THREE.DoubleSide, map: skyTexture });
	        skyMesh = new THREE.Mesh(skyGeom, skyMaterial);
	        var gndGeom = new THREE.CircleGeometry(skyRadius, skySegments);

	        //"ROOF"
			var gndTexture = THREE.ImageUtils.loadTexture( '/images/roof.jpg' );
			gndTexture .wrapS = THREE.RepeatWrapping;
			gndTexture .anisotropy = 1;
	        var gndMaterial = new THREE.MeshBasicMaterial({ map: gndTexture });
	        gndMesh = new THREE.Mesh(gndGeom, gndMaterial);
	        
        }
        

	
        
      },

      placeAt: function(container) {
        DomConstr.place(gl.domElement, container);
        
        container.appendChild(camXElem);
        container.appendChild(camYElem);
        container.appendChild(antXElem);
        container.appendChild(antYElem);
        
        On(gl.domElement, "mousedown", onMouseDown, false);
        On(gl.domElement, "mouseup", onMouseUp, false);
        On(gl.domElement, "mousemove", onMouseMove, false);
        On(gl.domElement, "mouseout", onMouseOut, false);
        
        scene.add(camBase);
        camBase.add(camera);
        camera.position.set(0, 0, 5);
        
        scene.add(circleMesh);
        circleMesh.rotation.setX(-Math.PI / 2.0);
        circleMesh.position.set(0, -standHeight, 0);
       
        
        scene.add(standMesh);
        standMesh.rotation.setX(-Math.PI / 2.0);
        standMesh.position.set(0, -standHeight, 0);
        
        standMesh.add(antMesh);
        antMesh.rotation.setX(-Math.PI / 2.0);
        antMesh.position.set(0, 0, standHeight);
        
        if (openglsupported){
	        scene.add(skyMesh);
	        skyMesh.position.setY(-standHeight * 2);
	        
	        scene.add(gndMesh);
	        gndMesh.rotation.setX(-Math.PI / 2.0);
	        gndMesh.position.setY(-standHeight-0.1 );
        }
	
        
        setTarget();
        var timer = setInterval(setTarget, 10 * 1000);
        animate();
      }

    });
  }
);