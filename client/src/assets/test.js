

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 125, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var bg_geo = new THREE.SphereGeometry( 90, 32, 32 );
var bg_mat = new THREE.MeshPhongMaterial();
//bg_mat.map    = THREE.ImageUtils.loadTexture('assets/constellations_map_equ11011.png');
bg_mat.map    = THREE.ImageUtils.loadTexture('assets/constellation_figures_print.jpg');
bg_mat.map.wrapS = THREE.RepeatWrapping;
bg_mat.side = THREE.BackSide;

var sky = new THREE.Group();

var bg = new THREE.Mesh( bg_geo, bg_mat );
sky.add( bg );

var lat = -39.5;
var coord_mat = new THREE.MeshLambertMaterial({color: 0xff0000});

// SOUTH CELESTIAL POLE
var SCP_geo = new THREE.SphereGeometry( 1, 32, 32 );
var SCP = new THREE.Mesh( SCP_geo, coord_mat );
SCP.position.set(0, -70, 0);
//sky.add(SCP);

// LAT/LONG ROTATION
sky.rotation.set(lat * Math.PI / 180, 0, lat< 0 ? Math.PI : 0)

scene.add(sky);

var N_geo = new THREE.SphereGeometry( 1, 32, 32 );
var N = new THREE.Mesh( N_geo, coord_mat );

N.position.set(0, 0, -70);
//scene.add( N );

// AXIS HELPER
var axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper );


// STARS
// Math from http://fmwriters.com/Visionback/Issue14/wbputtingstars.htm
var ACruxCoord = {
  r: 12*15 + 26*0.25 + 35.89522 * 0.004166,
  d: {d:-63, m:05, s:56.7343}
};
var ACruxPos = {
  r: ACruxCoord.r,
  d: ( Math.abs(ACruxCoord.d.d) + (ACruxCoord.d.m / 60) + (ACruxCoord.d.s / 3600)) * (ACruxCoord.d.d > 0 ? 1 : -1)
}
var ACruxGeo = new THREE.SphereGeometry( 1, 32, 32 );
var ACrux = new THREE.Mesh( ACruxGeo, coord_mat );
ACrux.position.set(
  70 * Math.cos(ACruxPos.d*Math.PI/180) * Math.cos(ACruxPos.r*Math.PI/180),  
  70 * Math.sin(ACruxPos.d*Math.PI/180),
  70 * Math.cos(ACruxPos.d*Math.PI/180) * Math.sin(ACruxPos.r*Math.PI/180),
);
sky.add(ACrux);

var BetelgeuseCoord = {
  r: 5*15 + 55*0.25 + 10.30536 * 0.004166,
  d: {d:7, m: 24, s:25.4304}
};
var BetelgeusePos = {
  r: BetelgeuseCoord.r,
  d: ( Math.abs(BetelgeuseCoord.d.d) + (BetelgeuseCoord.d.m / 60) + (BetelgeuseCoord.d.s / 3600)) * (BetelgeuseCoord.d.d > 0 ? 1 : -1)
}
var BetelgeuseGeo = new THREE.SphereGeometry( 1, 32, 32 );
var Betelgeuse = new THREE.Mesh( BetelgeuseGeo, coord_mat );
Betelgeuse.position.set(
  70 * Math.cos(BetelgeusePos.d*Math.PI/180) * Math.cos(BetelgeusePos.r*Math.PI/180),  
  70 * Math.sin(BetelgeusePos.d*Math.PI/180),
  70 * Math.cos(BetelgeusePos.d*Math.PI/180) * Math.sin(BetelgeusePos.r*Math.PI/180),
);
sky.add(Betelgeuse);

$.getJSON('assets/constellations.json', function(data){
  var constellations = data.Constellations;
  constellations.forEach(function(constellation){
    var stars = constellation.stars;
    stars.forEach(function(star){
      

      //instances geometry
      var geometry = new THREE.InstancedBufferGeometry();
      
      var vertices = new Float32Array( [
        - 0.05, - 0.05, 0,
          0.05, - 0.05, 0,
          0.05, 0.05, 0,
        - 0.05, 0.05, 0
      ] );
      
      var uvs = new Float32Array( [
        0, 0,
        1, 0,
        1, 1,
        0, 1
      ] );
      
      geometry.addAttribute("position", new THREE.Float32BufferAttribute( vertices, 3 ) );
      geometry.addAttribute("uv", new THREE.Float32BufferAttribute( uvs, 2 ) );
      geometry.setIndex( [ 0, 1, 2, 0, 2, 3 ] );
      
        

      var count = 3;
      var offsets = new Float32Array(count * 3);
      var uvOffset = new Float32Array(count * 2);
      var uvScales = new Float32Array(count * 2);

      //iterators
      var uvOffsetIterator = 0;
      var uvScalesIterator = 0;
      
      var cX = 389;
      var cY = 109;
      var cWidth = 25;
      var cHeight = 28;
      var left = cX / 512 - 3;
      var top = (512 - (cY + cHeight)) / 512 - 3;

      for (let i = 0; i < count; i++) {

        uvOffset[uvOffsetIterator++] = left;
        uvOffset[uvOffsetIterator++] = top;

        uvScales[uvScalesIterator++] = cWidth / 5.12;
        uvScales[uvScalesIterator++] = cHeight / 5.12;
      }

      //add buffers
      geometry.addAttribute(
        "offset",
        new THREE.InstancedBufferAttribute(offsets, 3, 1)
      );
      geometry.addAttribute(
        "uvOffset",
        new THREE.InstancedBufferAttribute(uvOffset, 2, 1)
      );
      geometry.addAttribute(
        "uvScale",
        new THREE.InstancedBufferAttribute(uvScales, 2, 1)
      );
      

      //material
      material = new THREE.ShaderMaterial({
        uniforms: {
          texture: { type: "t", value: null },
          opacity: { type: 'f', value: 1 },
          textColor: { type: 'c', value: new THREE.Color(0xffffff) },
          outlineColor: { type: 'c', value: new THREE.Color(0xff0000) },
          outlineDistance: { type: 'f', value: 0.38 },
          scale: { type: 'f', value: 0.5 }
        },
        vertexShader: document.getElementById("vert").innerText,
        fragmentShader: document.getElementById("frag").innerText,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
        transparent: true
      });
      
      material.extensions.derivatives = true;
      //mesh
      var mesh = new THREE.Mesh(geometry, material);

      var starPos = {
        r: star.RAh/24*360,
        d: star.DEd
      };

      mesh.position.set(
        70 * Math.cos(starPos.d*Math.PI/180) * Math.cos(starPos.r*Math.PI/180),  
        70 * Math.sin(starPos.d*Math.PI/180),
        70 * Math.cos(starPos.d*Math.PI/180) * Math.sin(starPos.r*Math.PI/180),
      );

      sky.add(mesh);
    });
  });
})

// LIGHT
var light = new THREE.AmbientLight( 0x888888 );
scene.add(light);


// CAMERA
var controls = new THREE.PointerLockControls( camera );
controls.enabled = false;
scene.add( controls.getObject() );
camera.position.x = 0;
camera.position.y = 0;     
camera.position.z = 0;

var animate = function () {
  requestAnimationFrame( animate );
  render();
};

function render() {
  renderer.render( scene, camera );
}

animate();
render();