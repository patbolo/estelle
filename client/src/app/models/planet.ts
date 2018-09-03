// Math from http://www.stjarnhimlen.se/comp/tutorial.html
// Keplerian orbital elements: https://ssd.jpl.nasa.gov/txt/p_elem_t1.txt
// Also of interest https://ssd.jpl.nasa.gov/txt/aprx_pos_planets.pdf

import { ICoord3D, IRADec } from './units';
import { UnitConversion } from '../services/coordinates-converter.service';

export const PlanetPerturbationCoefs = {
  Mj: 85.5238 * UnitConversion.DEG2RADEC, // Jupiter's perturbations
  Ms: 198.4741 * UnitConversion.DEG2RADEC, // Saturn's
  Mu: 101.0460 * UnitConversion.DEG2RADEC // Uranus's
};

export interface IPlanetaryOrbitalElements {
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

  perturbations?: {
    longitude?: Function;
    latitude?: Function;
  };
}

export class Planet {

  POE: IPlanetaryOrbitalElements;
  public geo: any;
  public mesh: any;

  constructor(POE: IPlanetaryOrbitalElements) {
    this.POE = POE;
  }

  rev(x: number): number {
    return  x - Math.floor(x / 360.0) * 360.0;
  }

  getLongAscNode(JD): number {
    return this.rev(this.POE.N1 + this.POE.N2 * JD) * UnitConversion.DEG2RADEC;
  }

  getInclination(JD): number {
    return this.rev(this.POE.I1 + this.POE.I2 * JD) * UnitConversion.DEG2RADEC;
  }

  getArgOfPerigee(JD): number {
    return this.rev(this.POE.W1 + this.POE.W2 * JD) * UnitConversion.DEG2RADEC;
  }

  getMeanDistance(): number {
    return this.POE.A;
  }

  getEccentricity(JD): number {
    return this.POE.E1 + this.POE.E2 * JD;
  }

  getMeanAnomaly(JD): number {
    return this.rev(this.POE.M1 + this.POE.M2 * JD) * UnitConversion.DEG2RADEC;
  }

  getEccentricAnomaly(JD): number {
    const M = this.getMeanAnomaly(JD);
    const E = this.getEccentricity(JD);

    let E0 = Number.MAX_VALUE;
    let E1 = M * UnitConversion.RADEC2DEG + (180 / Math.PI) * E * Math.sin(M) * (1 + E * Math.cos(M));
    while (Math.abs(E1 - E0) > 0.005) {
      E0 = E1;
      E1 = E0 - (E0 - (180 / Math.PI) * E * Math.sin(E0 * UnitConversion.DEG2RADEC) - M * UnitConversion.RADEC2DEG) / (1 - E * Math.cos(E0 * UnitConversion.DEG2RADEC));
    }
    return E1;
  }

  getDistance(JD): number {
    const EA = this.getEccentricAnomaly(JD);
    const E = this.getEccentricity(JD);
    const X = this.POE.A * (Math.cos(EA * UnitConversion.DEG2RADEC) - E);
    const Y = this.POE.A * Math.sqrt(1 - E * E) * Math.sin(EA * UnitConversion.DEG2RADEC);
    return Math.sqrt( X * X + Y * Y);
  }

  getTrueAnomaly(JD): number {
    const EA = this.getEccentricAnomaly(JD);
    const E = this.getEccentricity(JD);
    const X = this.POE.A * (Math.cos(EA * UnitConversion.DEG2RADEC) - E);
    const Y = this.POE.A * Math.sqrt(1 - E * E) * Math.sin(EA * UnitConversion.DEG2RADEC);
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
      z: dist * Math.sin(trueAnomaly + argOfPerigee) * Math.sin(inclination)
    };
  }

  getHelioEquatCoord(JD) {
    const eclip = this.getHelioEclipRectCoords(JD);
    const oblecl = 0 * UnitConversion.DEG2RADEC;
    return <ICoord3D>{
      x: eclip.x,
      y: eclip.y * Math.cos(oblecl) - eclip.z * Math.sin(oblecl),
      z: eclip.z * Math.sin(oblecl) + eclip.z * Math.cos(oblecl),
    };
  }

  getHelioRADec(JD): IRADec {
    const equat = this.getHelioEquatCoord(JD);
    const dist = this.getDistance(JD);
    let RA   = Math.atan2( equat.y, equat.x );
    let Decl = Math.asin( equat.z / dist );

    if (this.POE.perturbations) {
      if (this.POE.perturbations.longitude) {
        RA += this.POE.perturbations.longitude();
      }
      if (this.POE.perturbations.latitude) {
        Decl += this.POE.perturbations.latitude();
      }
    }
    console.log(this.rev(RA * UnitConversion.RADEC2DEG))
    console.log(this.rev(Decl * UnitConversion.RADEC2DEG))
    return <IRADec>{
      RA: Math.atan2( equat.y, equat.x ),
      dec: Math.asin( equat.z / dist )
    };
  }

  getGeocentricRADec(JD, sunEclipticCoordinates: ICoord3D): IRADec {
    const planetHelioEclipRectCoords: ICoord3D = this.getHelioEclipRectCoords(JD);
    const geoCentricCoords: ICoord3D = {
      x: planetHelioEclipRectCoords.x + sunEclipticCoordinates.x,
      y: planetHelioEclipRectCoords.y + sunEclipticCoordinates.y,
      z: planetHelioEclipRectCoords.z + sunEclipticCoordinates.z
    };
    const oblecl = 23.4406 * UnitConversion.DEG2RADEC;
    const equat: ICoord3D = {
      x: geoCentricCoords.x,
      y: geoCentricCoords.y * Math.cos(oblecl) - geoCentricCoords.z * Math.sin(oblecl),
      z: geoCentricCoords.y * Math.sin(oblecl) + geoCentricCoords.z * Math.cos(oblecl),
    };
    const dist = Math.sqrt( equat.x * equat.x + equat.y * equat.y + equat.z * equat.z);
    return <IRADec>{
      RA: Math.atan2( equat.y, equat.x ),
      dec: Math.asin( equat.z / dist )
    };
  }
}
