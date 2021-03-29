import { Component, AfterViewChecked } from '@angular/core';
import { CoordinatesConverterService } from '../services/coordinates-converter.service';
import { Sun } from '../models/sun';
import { Planet } from '../models/planet';
import { MarsOrbitalElements } from '../models/mars';
import { JupiterOrbitalElements } from '../models/jupiter';
import { SaturnOrbitalElements } from '../models/saturn';
import { UranusOrbitalElements } from '../models/uranus';

import { IRADec } from '../models/units';

@Component({
  selector: 'planetarium-component',
  template: `
    <div id="planetarium"></div>
  `
})
export class PlanetariumComponent implements AfterViewChecked {

  skyRadius = 100;

  // material
  starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      scale: { type: 'f', value: 0.5 },
      size: { type: 'f', value: 0.5 }
    },
    vertexShader: document.getElementById('vert').innerText,
    fragmentShader: document.getElementById('frag').innerText,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
    transparent: true
  });

  DSOMaterial = new THREE.ShaderMaterial({
    uniforms: {
      scale: { type: 'f', value: 0.05 }
    },
    vertexShader: document.getElementById('vert').innerText,
    fragmentShader: document.getElementById('frag-donut').innerText,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
    transparent: true
  });

  constructor(protected coordinatesConverterService: CoordinatesConverterService){
    this.starMaterial.extensions.derivatives = true;
    this.DSOMaterial.extensions.derivatives = true;
  }

  initialViewCheck = false;

  addBackground(sky): void {
    const bgGeo = new THREE.SphereGeometry( this.skyRadius + 2, 32, 32 );
    bgGeo.name = 'background';
    const bgMat = new THREE.MeshLambertMaterial({color: 0x000000});
    // const bgMat = new THREE.MeshPhongMaterial(/*{color: 0x000000}*/);
    // bgMat.map    = THREE.ImageUtils.loadTexture('assets/constellations_map_equ11011.png');
    // bgMat.map    = THREE.ImageUtils.loadTexture('assets/constellation_figures_print.jpg');
    // bgMat.map    = THREE.ImageUtils.loadTexture('assets/TychoSkymapII.t5_16384x08192.jpg');
    // bgMat.map    = THREE.ImageUtils.loadTexture('assets/sky_map.png');
    // bgMat.map.wrapS = THREE.RepeatWrapping;
    bgMat.side = THREE.BackSide;
    const bg = new THREE.Mesh( bgGeo, bgMat );
    sky.add( bg );
  }

  addGround(scene): void {
    const bgGeo = new THREE.PlaneGeometry( this.skyRadius * 2, this.skyRadius * 2 );
    bgGeo.name = 'ground';
    const bgMat = new THREE.MeshLambertMaterial({color: 0x000000});
    bgMat.side = THREE.BackSide;
    const bg = new THREE.Mesh( bgGeo, bgMat );
    bg.rotation.set(Math.PI / 2, 0, 0);
    bg.position.set(0, -0.1, 0);
    scene.add( bg );
  }

  addAxisHelper(scene): void {
    const axesHelper = new THREE.AxesHelper( 100 );
    scene.add( axesHelper );
  }

  addLight(scene): void {
    const light = new THREE.AmbientLight( 0x888888 );
    scene.add(light);
  }

  onZoomChanged(zoom): void {
    this.starMaterial.uniforms.size.value = Math.max(1, Math.min(2.5, zoom - 1));
    // console.log({ zoom }, this.starMaterial.uniforms.size.value)
  }

  addCamera(scene): void {
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const controls = new THREE.PointerLockControls(
      camera,
      scene,
      this,
      { onZoomChanged: this.onZoomChanged }
    );
    controls.enabled = false;
    scene.add( controls.getObject() );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    return camera;
  }

  drawConstellations(sky): void {
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

          // console.log({startStarRADec});

          const startStarPos = this.coordinatesConverterService.RADecToCartesian(startStarRADec, this.skyRadius + 1);
          const endStarPos = this.coordinatesConverterService.RADecToCartesian(endStarRADec, this.skyRadius + 1);
          // console.log({startStarPos})
          const material = new THREE.LineBasicMaterial({
            color: 0x000066
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

  drawStars(sky): void {
    $.getJSON('assets/hyg_custom_stars_catalogue.json', (stars) => {
      stars.forEach((star) => {
        if (star.mag > 6/* || star.con !== 'Sgr'*/) {
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

        geometry.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
        geometry.setAttribute('scale', new THREE.InstancedBufferAttribute( scale, 2, true ) );
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
        geometry.setAttribute(
          'offset',
          new THREE.InstancedBufferAttribute(offsets, 3, true)
        );
        geometry.setAttribute(
          'uvOffset',
          new THREE.InstancedBufferAttribute(uvOffset, 2, true)
        );
        geometry.setAttribute(
          'uvScale',
          new THREE.InstancedBufferAttribute(uvScales, 2, true)
        );

        // mesh
        const mesh = new THREE.Mesh(geometry, this.starMaterial);
        mesh.name = 'STAR';
        const starPos = this.coordinatesConverterService.RADecToCartesian({dec: star.decrad, RA: star.rarad}, this.skyRadius);

        mesh.position.set(starPos.x, starPos.y, starPos.z);

        sky.add(mesh);
      });
    });
  }

  drawDSO(sky): void {
    // material
    /*
    const material2 = new THREE.ShaderMaterial({
          uniforms: {
            scale: { type: 'f', value: 0.5 }
          },
          vertexShader: document.getElementById('vert').innerText,
          fragmentShader: document.getElementById('frag-donut').innerText,
          side: THREE.DoubleSide,
          blending: THREE.NormalBlending,
          transparent: true
        });
        material.extensions.derivatives = true;
        mesh.material = material2;
    */

    // instances geometry
    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array( [
      - 0.5, - 0.5, 0,
        0.5, - 0.5, 0,
        0.5, 0.5, 0,
      - 0.5, 0.5, 0
    ] );

    const uvs = new Float32Array( [
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ] );

    const scale = new Float32Array( [
      40 - -1 * 6,
      40 - -1 * 6
    ] );

    geometry.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
    geometry.setAttribute('scale', new THREE.InstancedBufferAttribute( scale, 2, true ) );
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
    geometry.setAttribute(
      'offset',
      new THREE.InstancedBufferAttribute(offsets, 3, true)
    );
    geometry.setAttribute(
      'uvOffset',
      new THREE.InstancedBufferAttribute(uvOffset, 2, true)
    );
    geometry.setAttribute(
      'uvScale',
      new THREE.InstancedBufferAttribute(uvScales, 2, true)
    );
    const material = new THREE.MeshLambertMaterial( { color: 0xdddddd, opacity: 0.1, transparent: true } );
    const transform = new THREE.Object3D();

    $.getJSON('assets/NI2018.json', (objects) => {
      // objects = [objects[6989]];
      // objects = [objects[2059]]; // M42
      // console.log(objects);
      const mesh = new THREE.InstancedMesh( geometry, material, objects.length );
      let i = 0;
      objects.forEach((object) => {
        const RA = this.coordinatesConverterService.HMSToRadians(object[8], object[9], object[10]);
        let Dec = this.coordinatesConverterService.DMSToRadians(object[12], object[13], object[14]);
        Dec = object[11] === '-' ? -Dec : Dec;
        const objPos = this.coordinatesConverterService.RADecToCartesian({dec: Dec, RA}, this.skyRadius);
        transform.position.set(objPos.x, objPos.y, objPos.z);
        transform.lookAt(0, 0, 0);
        transform.updateMatrix();
        transform.name = 'DSO' + object[0] + object[1];
        mesh.setMatrixAt( i++, transform.matrix );
      });
      sky.add(mesh);
    });
  }

  addMoon(sky): void {
    const moonRADec = this.coordinatesConverterService.getMoonCoordinates(/*2018, 8, 21, 9, 54*/);
    const moonPos = this.coordinatesConverterService.RADecToCartesian({dec: moonRADec.dec, RA: moonRADec.RA}, this.skyRadius);
    const moonGeo = new THREE.SphereGeometry( 2, 32, 32 );
    moonGeo.name = 'moon';
    const moonMesh = new THREE.Mesh( moonGeo, new THREE.MeshLambertMaterial({color: 0xdddddd}) );
    moonMesh.position.set(moonPos.x, moonPos.y, moonPos.z);
    sky.add(moonMesh);
  }

  addMars(sky, sunEclipRectCoords): void {
    const mars = new Planet(MarsOrbitalElements);
    mars.geo = new THREE.SphereGeometry( 1, 32, 32 );
    mars.geo.name = 'mars';
    mars.mesh = new THREE.Mesh( mars.geo, new THREE.MeshLambertMaterial({color: 0xdd3333}) );
    const marsRADec = mars.getGeocentricRADec(this.coordinatesConverterService.getDaysToJ2000(), sunEclipRectCoords);
    const marsGeoPos = this.coordinatesConverterService.RADecToCartesian(marsRADec, this.skyRadius);
    mars.mesh.position.set(marsGeoPos.x, marsGeoPos.y, marsGeoPos.z);
    sky.add(mars.mesh);
  }

  addJupiter(sky, sunEclipRectCoords): void {
    const jupiter = new Planet(JupiterOrbitalElements);
    jupiter.geo = new THREE.SphereGeometry( 1, 32, 32 );
    jupiter.geo.name = 'jupiter';
    jupiter.mesh = new THREE.Mesh( jupiter.geo, new THREE.MeshLambertMaterial({color: 0x33dddd}) );
    const jupiterRADec = jupiter.getGeocentricRADec(this.coordinatesConverterService.getDaysToJ2000(), sunEclipRectCoords);
    const jupiterGeoPos = this.coordinatesConverterService.RADecToCartesian(jupiterRADec, this.skyRadius);
    jupiter.mesh.position.set(jupiterGeoPos.x, jupiterGeoPos.y, jupiterGeoPos.z);
    sky.add(jupiter.mesh);
  }

  addSaturn(sky, sunEclipRectCoords): void {
    const saturn = new Planet(SaturnOrbitalElements);
    saturn.geo = new THREE.SphereGeometry( 1, 32, 32 );
    saturn.geo.name = 'saturn';
    saturn.mesh = new THREE.Mesh( saturn.geo, new THREE.MeshLambertMaterial({color: 0x33dddd}) );
    const saturnRADec = saturn.getGeocentricRADec(this.coordinatesConverterService.getDaysToJ2000(), sunEclipRectCoords);
    const saturnGeoPos = this.coordinatesConverterService.RADecToCartesian(saturnRADec, this.skyRadius);
    saturn.mesh.position.set(saturnGeoPos.x, saturnGeoPos.y, saturnGeoPos.z);
    sky.add(saturn.mesh);
  }

  addUranus(sky, sunEclipRectCoords): void {
    const uranus = new Planet(UranusOrbitalElements);
    uranus.geo = new THREE.SphereGeometry( 1, 32, 32 );
    uranus.geo.name = 'uranus';
    uranus.mesh = new THREE.Mesh( uranus.geo, new THREE.MeshLambertMaterial({color: 0x33dddd}) );
    const uranusRADec = uranus.getGeocentricRADec(this.coordinatesConverterService.getDaysToJ2000(), sunEclipRectCoords);
    const uranusGeoPos = this.coordinatesConverterService.RADecToCartesian(uranusRADec, this.skyRadius);
    uranus.mesh.position.set(uranusGeoPos.x, uranusGeoPos.y, uranusGeoPos.z);
    sky.add(uranus.mesh);
  }

  ngAfterViewChecked(): void {
    if (this.initialViewCheck) {
      return;
    }
    this.initialViewCheck = true;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth - 450, window.innerHeight - 250 );
    document.getElementById('planetarium').appendChild( renderer.domElement );

    this.addLight(scene);
    const camera = this.addCamera(scene);
    const sky = new THREE.Group();
    sky.name = 'sky';
    const lat = -39.5;
    const longitude = 176.8854;
    /*const lat = 0;
    const longitude = 0;*/
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
    this.addAxisHelper(scene);
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

    // const mercury = new Mercury();
    // mercury.getHelioEclipRectCoords(-3543);
    // console.log(mercury.getGeocentricRADec(-3543, sunEclipRectCoords));

    /*this.addMars(sky, sunEclipRectCoords);
    this.addSaturn(sky, sunEclipRectCoords);
    this.addJupiter(sky, sunEclipRectCoords);
    this.addUranus(sky, sunEclipRectCoords);*/
    this.drawDSO(sky);

    const animate = () => {
      requestAnimationFrame( animate );
      render();
    };

    const render = () => {
      renderer.render( scene, camera );
    };

    animate();
    render();
  }
}
