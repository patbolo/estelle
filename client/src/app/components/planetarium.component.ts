import { Component, AfterViewChecked } from '@angular/core';
import { CoordinatesConverterService } from '../services/coordinates-converter.service';
import { Mars } from '../models/mars';
import { Mercury } from '../models/mercury';
import { Sun } from '../models/sun';
import { ICoord3D, IRADec } from '../models/units';

@Component({
  selector: 'planetarium-component',
  template: `
    <div id="planetarium"></div>
  `
})
export class PlanetariumComponent implements AfterViewChecked {

  skyRadius = 100;

  constructor(protected coordinatesConverterService: CoordinatesConverterService){}

  initialViewCheck = false;

  addBackground(sky) {
    const bg_geo = new THREE.SphereGeometry( this.skyRadius + 2, 32, 32 );
    const bg_mat = new THREE.MeshLambertMaterial({color: 0x000000});
    // const bg_mat = new THREE.MeshPhongMaterial(/*{color: 0x000000}*/);
    // bg_mat.map    = THREE.ImageUtils.loadTexture('assets/constellations_map_equ11011.png');
    // bg_mat.map    = THREE.ImageUtils.loadTexture('assets/constellation_figures_print.jpg');
    // bg_mat.map    = THREE.ImageUtils.loadTexture('assets/TychoSkymapII.t5_16384x08192.jpg');
    bg_mat.map    = THREE.ImageUtils.loadTexture('assets/sky_map.png');
    bg_mat.map.wrapS = THREE.RepeatWrapping;
    bg_mat.side = THREE.BackSide;
    const bg = new THREE.Mesh( bg_geo, bg_mat );
    sky.add( bg );
  }

  addGround(scene) {
    const bg_geo = new THREE.PlaneGeometry( this.skyRadius * 2, this.skyRadius * 2 );
    const bg_mat = new THREE.MeshLambertMaterial({color: 0x000000});
    bg_mat.side = THREE.BackSide;
    const bg = new THREE.Mesh( bg_geo, bg_mat );
    bg.rotation.set(Math.PI / 2, 0, 0);
    bg.position.set(0, -0.1, 0);
    scene.add( bg );
  }

  /*addSouthCelestialPole(sky) {
    const SCP_geo = new THREE.SphereGeometry( 1, 32, 32 );
    const SCP = new THREE.Mesh( SCP_geo, new THREE.MeshLambertMaterial({color: 0xff0000}) );
    SCP.position.set(0, -70, 0);
    sky.add(SCP);
  }*/

  /*addACrux(sky) {
    // Math from http://fmwriters.com/Visionback/Issue14/wbputtingstars.htm
    const ACruxCoord = {
      r: 12 * 15 + 26 * 0.25 + 35.89522 * 0.004166,
      d: {d: -63, m: 5, s: 56.7343}
    };
    const ACruxPos = {
      r: ACruxCoord.r,
      d: ( Math.abs(ACruxCoord.d.d) + (ACruxCoord.d.m / 60) + (ACruxCoord.d.s / 3600)) * (ACruxCoord.d.d > 0 ? 1 : -1)
    };
    const ACruxGeo = new THREE.SphereGeometry( 1, 32, 32 );
    const ACrux = new THREE.Mesh( ACruxGeo, new THREE.MeshLambertMaterial({color: 0xff0000}) );
    ACrux.position.set(
      70 * Math.cos(ACruxPos.d * Math.PI / 180) * Math.cos(ACruxPos.r * Math.PI / 180),
      70 * Math.sin(ACruxPos.d * Math.PI / 180),
      70 * Math.cos(ACruxPos.d * Math.PI / 180) * Math.sin(ACruxPos.r * Math.PI / 180),
    );
    sky.add(ACrux);
  }*/

  /*addBetelgeuse(sky) {
    // Math from http://fmwriters.com/Visionback/Issue14/wbputtingstars.htm
    const BetelgeuseCoord = {
      r: 5 * 15 + 55 * 0.25 + 10.30536 * 0.004166,
      d: {d: 7, m: 24, s: 25.4304}
    };
    const BetelgeusePos = {
      r: BetelgeuseCoord.r,
      d: ( Math.abs(BetelgeuseCoord.d.d) + (BetelgeuseCoord.d.m / 60) + (BetelgeuseCoord.d.s / 3600)) * (BetelgeuseCoord.d.d > 0 ? 1 : -1)
    };
    const BetelgeuseGeo = new THREE.SphereGeometry( 1, 32, 32 );
    const Betelgeuse = new THREE.Mesh( BetelgeuseGeo, new THREE.MeshLambertMaterial({color: 0xff0000}) );
    console.log(BetelgeusePos.r * Math.PI / 180);
    console.log(BetelgeusePos.d * Math.PI / 180);
    Betelgeuse.position.set(
      70 * Math.cos(BetelgeusePos.d * Math.PI / 180) * Math.cos(BetelgeusePos.r * Math.PI / 180),
      70 * Math.sin(BetelgeusePos.d * Math.PI / 180),
      70 * Math.cos(BetelgeusePos.d * Math.PI / 180) * Math.sin(BetelgeusePos.r * Math.PI / 180),
    );
    sky.add(Betelgeuse);
  }*/

  addAxisHelper(scene) {
    const axesHelper = new THREE.AxesHelper( 100 );
    scene.add( axesHelper );
  }

  addLight(scene) {
    const light = new THREE.AmbientLight( 0x888888 );
    scene.add(light);
  }

  addCamera(scene) {
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const controls = new THREE.PointerLockControls( camera );
    controls.enabled = false;
    scene.add( controls.getObject() );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    return camera;
  }

  drawConstellations(sky) {
    $.getJSON('assets/constellations.json', (data) => {
      const constellations = data.Constellations;
      constellations.forEach((constellation) => {
        const stars = constellation.stars;
        const lines = constellation.lines;
        lines.forEach((line) => {
          const indexStartStar = line[0];
          const indexEndStar = line[1];

          let startStar;
          let endStar;

          stars.forEach( (star) => {
            if (Number(star.id) === indexStartStar) {
              startStar = star;
            }
            if (Number(star.id) === indexEndStar) {
              endStar = star;
            }
          });

          const startStarRADec: IRADec = {
            RA: (startStar.RAh / 24 * 360) * this.coordinatesConverterService.DEG2RADEC,
            dec: startStar.DEd * this.coordinatesConverterService.DEG2RADEC
          };
          const endStarRADec: IRADec = {
            RA: (endStar.RAh / 24 * 360) * this.coordinatesConverterService.DEG2RADEC,
            dec: endStar.DEd * this.coordinatesConverterService.DEG2RADEC
          };

          const startStarPos = this.coordinatesConverterService.RADecToCartesian(startStarRADec, this.skyRadius + 1);
          const endStarPos = this.coordinatesConverterService.RADecToCartesian(endStarRADec, this.skyRadius + 1);

          const material = new THREE.LineBasicMaterial({
            color: 0x000033
          });

          const geometry = new THREE.Geometry();
          geometry.vertices.push(
            new THREE.Vector3( startStarPos.x, startStarPos.y, startStarPos.z ),
            new THREE.Vector3( endStarPos.x, endStarPos.y, endStarPos.z )
          );

          const segment = new THREE.Line( geometry, material );

          sky.add(segment);
        });
      });
    });
  }

  drawStars(sky) {
    $.getJSON('assets/hyg_custom_stars_catalogue.json', (stars) => {
      stars.forEach((star) => {
        if (star.mag > 6) {
          return;
        }

        // instances geometry
        const geometry = new THREE.InstancedBufferGeometry();

        const vertices = new Float32Array( [
          - 0.05, - 0.05, 0,
            0.05, - 0.05, 0,
            0.05, 0.05, 0,
          - 0.05, 0.05, 0
        ] );

        const uvs = new Float32Array( [
          0, 0,
          1, 0,
          1, 1,
          0, 1
        ] );

        const scale = new Float32Array( [
          40 - star.mag * 6,
          40 - star.mag * 6
        ] );

        geometry.addAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        geometry.addAttribute('uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
        geometry.addAttribute('scale', new THREE.InstancedBufferAttribute( scale, 2 ) );
        geometry.setIndex( [ 0, 1, 2, 0, 2, 3 ] );

        const count = 1;
        const offsets = new Float32Array(count * 3);
        const uvOffset = new Float32Array(count * 2);
        const uvScales = new Float32Array(count * 2);

        // iterators
        let uvOffsetIterator = 0;
        let uvScalesIterator = 0;

        const cX = 389;
        const cY = 109;
        const cWidth = 25;
        const cHeight = 28;
        const left = cX / 512 - 3;
        const top = (512 - (cY + cHeight)) / 512 - 3;

        for (let i = 0; i < count; i++) {

          uvOffset[uvOffsetIterator++] = left;
          uvOffset[uvOffsetIterator++] = top;

          uvScales[uvScalesIterator++] = cWidth / 5.12;
          uvScales[uvScalesIterator++] = cHeight / 5.12;
        }

        // add buffers
        geometry.addAttribute(
          'offset',
          new THREE.InstancedBufferAttribute(offsets, 3, 1)
        );
        geometry.addAttribute(
          'uvOffset',
          new THREE.InstancedBufferAttribute(uvOffset, 2, 1)
        );
        geometry.addAttribute(
          'uvScale',
          new THREE.InstancedBufferAttribute(uvScales, 2, 1)
        );


        // material
        const material = new THREE.ShaderMaterial({
          uniforms: {
            scale: { type: 'f', value: 0.5 }
          },
          vertexShader: document.getElementById('vert').innerText,
          fragmentShader: document.getElementById('frag').innerText,
          side: THREE.DoubleSide,
          blending: THREE.NormalBlending,
          transparent: true
        });

        material.extensions.derivatives = true;
        // mesh
        const mesh = new THREE.Mesh(geometry, material);

        const starPos = this.coordinatesConverterService.RADecToCartesian({dec: star.decrad, RA: star.rarad}, this.skyRadius);

        mesh.position.set(starPos.x, starPos.y, starPos.z);

        sky.add(mesh);
      });
    });
  }

  addMoon(sky) {
    const moonRADec = this.coordinatesConverterService.getMoonCoordinates(/*2018, 8, 21, 9, 54*/);
    const moonPos = this.coordinatesConverterService.RADecToCartesian({dec: moonRADec.dec, RA: moonRADec.RA}, this.skyRadius);
    const moonGeo = new THREE.SphereGeometry( 2, 32, 32 );
    const moonMesh = new THREE.Mesh( moonGeo, new THREE.MeshLambertMaterial({color: 0xdddddd}) );
    moonMesh.position.set(moonPos.x, moonPos.y, moonPos.z);
    sky.add(moonMesh);
  }

  addMars(sky, sunEclipRectCoords) {
    const mars = new Mars();
    const marsRADec = mars.getGeocentricRADec(this.coordinatesConverterService.getDaysToJ2000(), sunEclipRectCoords);
    const marsGeoPos = this.coordinatesConverterService.RADecToCartesian(marsRADec, this.skyRadius);
    const marsGeo = new THREE.SphereGeometry( 1, 32, 32 );
    const marsMesh = new THREE.Mesh( marsGeo, new THREE.MeshLambertMaterial({color: 0xdd3333}) );
    marsMesh.position.set(marsGeoPos.x, marsGeoPos.y, marsGeoPos.z);
    sky.add(marsMesh);
  }

  ngAfterViewChecked() {
    if (this.initialViewCheck) {
      return;
    }
    this.initialViewCheck = true;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('planetarium').appendChild( renderer.domElement );

    this.addLight(scene);
    const camera = this.addCamera(scene);
    const sky = new THREE.Group();
    const lat = -39.5;
    const longitude = 176.8854;
    const LMST = this.coordinatesConverterService.getLocalSiderealTime(longitude);
    // LAT/LONG ROTATION
    const skyRotX = (lat < 0 ? -90 - lat : 90 - lat) * this.coordinatesConverterService.DEG2RADEC;
    const skyRotY = ( (lat < 0 ? LMST : -LMST) * 15) * this.coordinatesConverterService.DEG2RADEC + Math.PI / 2;
    const skyRotZ = lat < 0 ? Math.PI : 0;
    sky.rotation.set(skyRotX, skyRotY, skyRotZ);
    scene.add(sky);

    /*let rot = skyRotY;
    setInterval(() => {
      rot += 1;
      sky.rotation.set(skyRotX, rot * Math.PI / 180, skyRotZ);
    }, 100);*/

    this.addBackground(sky);
    this.addGround(scene);
    // this.addAxisHelper(scene);
    // this.addSouthCelestialPole(sky);
    // this.addACrux(sky);
    // this.addBetelgeuse(sky);

    this.drawConstellations(sky);
    this.drawStars(sky);

    this.addMoon(sky);

    /*const mars = new Mars();
    mars.getHelioEclipRectCoords(this.coordinatesConverterService.getDaysToJ2000());
    mars.getRADec(-3543);
    console.log(this.coordinatesConverterService.getDaysToJ2000(1990, 4, 19, 0, 0));*/

    const sun = new Sun();
    sun.coordinatesConverterService = this.coordinatesConverterService;
    const sunEclipRectCoords = sun.getEclipRectCoords(this.coordinatesConverterService.getDaysToJ2000());
    // console.log(mars.getGeocentricCoordinates(-3543, sunEclipRectCoords));

    const mercury = new Mercury();
    mercury.getHelioEclipRectCoords(-3543);
    // console.log(mercury.getGeocentricRADec(-3543, sunEclipRectCoords));

    this.addMars(sky, sunEclipRectCoords);

    const animate = function () {
      requestAnimationFrame( animate );
      render();
    };

    function render() {
      renderer.render( scene, camera );
    }

    animate();
    render();
  }
}
