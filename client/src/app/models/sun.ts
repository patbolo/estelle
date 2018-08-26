import { CoordinatesConverterService } from '../services/coordinates-converter.service';
import { ICoord3D, IRADec } from './units';

export class Sun {

  public coordinatesConverterService: CoordinatesConverterService;

  W1 = 282.9404; // ArgOfPerigee
  W2 = 4.70935E-5; // ArgOfPerigee
  A = 1.0; // Mean distance
  E1 = 0.016709; // Eccentricity
  E2 = -1.151E-9; // Eccentricity
  M1 = 356.0470; // Mean anomaly
  M2 = 0.9856002585; // Mean anomaly
  O1 = 23.4393; // Obliquity of ecliptic
  O2 = -3.563E-7; // Obliquity of ecliptic

  getArgOfPerigee(JD): number {
    return this.coordinatesConverterService.rev(this.W1 + this.W2 * JD) * Math.PI / 180;
  }

  getMeanDistance(): number {
    return this.A;
  }

  getEccentricity(JD): number {
    return this.E1 + this.E2 * JD;
  }

  getMeanAnomaly(JD): number {
    return this.coordinatesConverterService.rev(this.M1 + this.M2 * JD) * Math.PI / 180;
  }
  getObliquity(JD): number {
    return this.coordinatesConverterService.rev(this.O1 + this.O2 * JD) * Math.PI / 180;
  }

  getEclipRectCoords(JD): ICoord3D {
    const w = this.getArgOfPerigee(JD);
    const M = this.getMeanAnomaly(JD);
    const L = this.coordinatesConverterService.rev(w + M);
    const oblecl = this.getObliquity(JD);
    const E = this.getEccentricity(JD);
    const E0 = this.coordinatesConverterService.rev(
        M * 180 / Math.PI + (180 / Math.PI) * E * Math.sin(M) * (1 + E * Math.cos(M))
      ) * Math.PI / 180;

    const x = Math.cos(E0) - E;
    const y = Math.sin(E0) * Math.sqrt(1 - E * E);

    const r = Math.sqrt(x * x + y * y);
    const v = Math.atan2( y, x );

    // console.log({W: w * 180 / Math.PI, M: M * 180 / Math.PI, L: L * 180 / Math.PI, oblecl: oblecl * 180 / Math.PI, E, E0: E0 * 180 / Math.PI, x, y, r, v: v*180/Math.PI});

    const lon = this.coordinatesConverterService.rev(v + w);
    // console.log(lon * 180 / Math.PI);

    return <ICoord3D> {
      x: r * Math.cos(lon),
      y: r * Math.sin(lon),
      z: 0.0
    };
  }

}
