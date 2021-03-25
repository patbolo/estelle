/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera, scene, planetarium, callbacks ) {

	var scope = this;

	var zoom = 1;
	var zoomIncrement = 0.1;

	

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.add( pitchObject );

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.003;
		pitchObject.rotation.x -= movementY * 0.003;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

		// Above horizon always
		pitchObject.rotation.x = Math.max( 0, pitchObject.rotation.x );
	};

	var onScroll = function ( event ) {
		event.preventDefault();
		zoom = zoom + (event.deltaY < 0 ? zoomIncrement : -zoomIncrement);
		camera.zoom = zoom;
		camera.updateProjectionMatrix();
		if (callbacks.onZoomChanged) {
			callbacks.onZoomChanged.bind(planetarium)(zoom);
		}
	};

	var onMouseDown = function( event ) {
		scope.enabled = true;
	};

	var onMouseUp  = function( event ) {
		console.log(event)
		scope.enabled = false;
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.offsetY / event.target.height ) * 2 + 1;
		console.log(mouse)
		// update the picking ray with the camera and mouse position
		raycaster.setFromCamera( mouse, camera );

		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( scene.children, true );
		console.log(intersects);

		/*var geo = new THREE.SphereGeometry( 1, 32, 32 );
    var mesh = new THREE.Mesh( geo, new THREE.MeshLambertMaterial({color: 0xdd3333}) );
    mesh.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
    scene.add(mesh);*/
	};

	this.dispose = function () {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mousedown', onMouseDown, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'mousedown', onMouseDown, false );
	document.addEventListener( 'mouseup', onMouseUp, false );
	document.addEventListener( 'wheel', onScroll, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.getDirection = function () {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, - 1 );
		var rotation = new THREE.Euler( 0, 0, 0, 'YXZ' );

		return function ( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		};

	}();

};
