import { IPlanetaryOrbitalElements, PlanetPerturbationCoefs } from './planet';
import { UnitConversion } from '../services/coordinates-converter.service';

export const SaturnOrbitalElements: IPlanetaryOrbitalElements = {
  N1: 113.6634, // LongAscNode
  N2: 2.38980E-5, // LongAscNode
  I1: 2.4886, // Inclination
  I2: -1.081E-7, // Inclination
  W1: 339.3939, // ArgOfPerigee
  W2: 2.97661E-5, // ArgOfPerigee
  A: 9.55475, // Mean distance
  E1: 0.055546, // Eccentricity
  E2: -9.499E-9, // Eccentricity
  M1: 316.9670, // Mean anomaly
  M2: 0.0334442282, // Mean anomaly

  perturbations: {
    longitude: () => {
      return   0.812 * UnitConversion.DEG2RADEC * Math.sin(2 * PlanetPerturbationCoefs.Mj - 5 * PlanetPerturbationCoefs.Ms - 67.6 * UnitConversion.DEG2RADEC)
             - 0.229 * UnitConversion.DEG2RADEC * Math.cos(2 * PlanetPerturbationCoefs.Mj - 4 * PlanetPerturbationCoefs.Ms - 2 * UnitConversion.DEG2RADEC)
             + 0.119 * UnitConversion.DEG2RADEC * Math.sin(PlanetPerturbationCoefs.Mj - 2 * PlanetPerturbationCoefs.Ms - 3 * UnitConversion.DEG2RADEC)
             + 0.046 * UnitConversion.DEG2RADEC * Math.sin(2 * PlanetPerturbationCoefs.Mj - 6 * PlanetPerturbationCoefs.Ms - 69 * UnitConversion.DEG2RADEC)
             + 0.014 * UnitConversion.DEG2RADEC * Math.sin(PlanetPerturbationCoefs.Mj - 3 * PlanetPerturbationCoefs.Ms + 32 * UnitConversion.DEG2RADEC);
    },
    latitude: () => {
      return - 0.020 * UnitConversion.DEG2RADEC * Math.cos(2 * PlanetPerturbationCoefs.Mj - 4 * PlanetPerturbationCoefs.Ms - 2 * UnitConversion.DEG2RADEC)
             + 0.018 * UnitConversion.DEG2RADEC * Math.sin(2 * PlanetPerturbationCoefs.Mj - 6 * PlanetPerturbationCoefs.Ms - 49 * UnitConversion.DEG2RADEC);
    }
  }
};

