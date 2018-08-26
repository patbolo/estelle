// Math from http://www.stjarnhimlen.se/comp/tutorial.html
// Keplerian orbital elements: https://ssd.jpl.nasa.gov/txt/p_elem_t1.txt
// Also of interest https://ssd.jpl.nasa.gov/txt/aprx_pos_planets.pdf

import { ICoord3D, IRADec } from './units';

export abstract class Planet {

  N1: number; // LongAscNode
  N2: number; // LongAscNode
  I1: number; // Inclination
  I2: number; // Inclination
  W1: number; // ArgOfPerigee
  W2: number; // ArgOfPerigee
  A: number; // Mean distance
  E1: number; // Eccentricity
  E2: number; // Eccentricity
  M1: number; // Mean anomaly
  M2: number; // Mean anomaly

  rev(x: number): number {
    return  x - Math.floor(x / 360.0) * 360.0;
  }

  getLongAscNode(JD): number {
    return this.rev(this.N1 + this.N2 * JD) * Math.PI / 180;
  }

  getInclination(JD): number {
    return this.rev(this.I1 + this.I2 * JD) * Math.PI / 180;
  }

  getArgOfPerigee(JD): number {
    return this.rev(this.W1 + this.W2 * JD) * Math.PI / 180;
  }

  getMeanDistance(): number {
    return this.A;
  }

  getEccentricity(JD): number {
    return this.E1 + this.E2 * JD;
  }

  getMeanAnomaly(JD): number {
    return this.rev(this.M1 + this.M2 * JD) * Math.PI / 180;
  }

  getEccentricAnomaly(JD): number {
    const M = this.getMeanAnomaly(JD);
    const E = this.getEccentricity(JD);

    let E0 = Number.MAX_VALUE;
    let E1 = M * 180 / Math.PI + (180 / Math.PI) * E * Math.sin(M) * (1 + E * Math.cos(M));
    while (Math.abs(E1 - E0) > 0.005) {
      E0 = E1;
      E1 = E0 - (E0 - (180 / Math.PI) * E * Math.sin(E0 * Math.PI / 180) - M * 180 / Math.PI) / (1 - E * Math.cos(E0 * Math.PI / 180));
    }
    return E1;
  }

  getDistance(JD): number {
    const EA = this.getEccentricAnomaly(JD);
    const E = this.getEccentricity(JD);
    const X = this.A * (Math.cos(EA * Math.PI / 180) - E);
    const Y = this.A * Math.sqrt(1 - E * E) * Math.sin(EA * Math.PI / 180);
    return Math.sqrt( X * X + Y * Y);
  }

  getTrueAnomaly(JD): number {
    const EA = this.getEccentricAnomaly(JD);
    const E = this.getEccentricity(JD);
    const X = this.A * (Math.cos(EA * Math.PI / 180) - E);
    const Y = this.A * Math.sqrt(1 - E * E) * Math.sin(EA * Math.PI / 180);
    return Math.atan2(Y, X);
  }

  getHelioEclipRectCoords(JD): ICoord3D {
    const dist = this.getDistance(JD);
    const longAscNode = this.getLongAscNode(JD);
    const trueAnomaly = this.getTrueAnomaly(JD);
    const argOfPerigee = this.getArgOfPerigee(JD);
    const inclination = this.getInclination(JD);
    return <ICoord3D>{
      x: dist * (
        Math.cos(longAscNode) * Math.cos(trueAnomaly + argOfPerigee) -
        Math.sin(longAscNode) * Math.sin(trueAnomaly + argOfPerigee) * Math.cos(inclination)
      ),
      y: dist * (
        Math.sin(longAscNode) * Math.cos(trueAnomaly + argOfPerigee) +
        Math.cos(longAscNode) * Math.sin(trueAnomaly + argOfPerigee) * Math.cos(inclination)
      ),
      z: dist * Math.sin(trueAnomaly + argOfPerigee) * Math.sin(inclination);
    };
  }

  getHelioEquatCoord(JD) {
    const eclip = this.getHelioEclipRectCoords(JD);
    const oblecl = 0 * Math.PI / 180;
    return <ICoord3D>{
      x: eclip.x,
      y: eclip.y * Math.cos(oblecl) - eclip.z * Math.sin(oblecl),
      z: eclip.z * Math.sin(oblecl) + eclip.z * Math.cos(oblecl),
    };
  }

  getHelioRADec(JD): IRADec {
    const equat = this.getHelioEquatCoord(JD);
    const dist = this.getDistance(JD);
    const RA   = Math.atan2( equat.y, equat.x );
    const Decl = Math.asin( equat.z / dist );
    console.log({RA: this.rev(RA * 180 / Math.PI), DEC: Decl * 180 / Math.PI});
    return <IRADec>{
      RA: Math.atan2( equat.y, equat.x ),
      Dec: Math.asin( equat.z / dist )
    };
  }

  getGeocentricRADec(JD, sunEclipticCoordinates: ICoord3D): IRADec {
    const planetHelioEclipRectCoords: ICoord3D = this.getHelioEclipRectCoords(JD);
    const geoCentricCoords: ICoord3D = {
      x: planetHelioEclipRectCoords.x + sunEclipticCoordinates.x,
      y: planetHelioEclipRectCoords.y + sunEclipticCoordinates.y,
      z: planetHelioEclipRectCoords.z + sunEclipticCoordinates.z
    };
    const oblecl = 23.4406 * Math.PI / 180;
    const equat: ICoord3D = {
      x: geoCentricCoords.x,
      y: geoCentricCoords.y * Math.cos(oblecl) - geoCentricCoords.z * Math.sin(oblecl),
      z: geoCentricCoords.y * Math.sin(oblecl) + geoCentricCoords.z * Math.cos(oblecl),
    };
    const dist = Math.sqrt( equat.x * equat.x + equat.y * equat.y + equat.z * equat.z);
    console.log({dist})
    const RA   = Math.atan2( equat.y, equat.x );
    const Decl = Math.asin( equat.z / dist );
    return <IRADec>{
      RA: this.rev(RA * 180 / Math.PI),
      Dec: Decl * 180 / Math.PI
    };
  }
}
