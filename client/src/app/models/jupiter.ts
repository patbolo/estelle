import { IPlanetaryOrbitalElements, PlanetPerturbationCoefs } from './planet';
import { UnitConversion } from '../services/coordinates-converter.service';

export const JupiterOrbitalElements: IPlanetaryOrbitalElements = {
  N1: 100.4542, // LongAscNode
  N2: 2.76854E-5, // LongAscNode
  I1: 1.3030, // Inclination
  I2: -1.557E-7, // Inclination
  W1: 273.8777, // ArgOfPerigee
  W2: 1.64505E-5, // ArgOfPerigee
  A: 5.20256, // Mean distance
  E1: 0.048498, // Eccentricity
  E2: 4.469E-9, // Eccentricity
  M1: 19.8950, // Mean anomaly
  M2: 0.0830853001, // Mean anomaly

  perturbations: {
    longitude: () => {
      return  - 0.332 * UnitConversion.DEG2RADEC * Math.sin(2 * PlanetPerturbationCoefs.Mj - 5 * PlanetPerturbationCoefs.Ms - 67.6 * UnitConversion.DEG2RADEC)
              - 0.056 * UnitConversion.DEG2RADEC * Math.sin(2 * PlanetPerturbationCoefs.Mj - 2 * PlanetPerturbationCoefs.Ms + 21 * UnitConversion.DEG2RADEC)
              + 0.042 * UnitConversion.DEG2RADEC * Math.sin(3 * PlanetPerturbationCoefs.Mj - 5 * PlanetPerturbationCoefs.Ms + 21 * UnitConversion.DEG2RADEC)
              - 0.036 * UnitConversion.DEG2RADEC * Math.sin(PlanetPerturbationCoefs.Mj - 2 * PlanetPerturbationCoefs.Ms)
              + 0.022 * UnitConversion.DEG2RADEC * Math.cos(PlanetPerturbationCoefs.Mj - PlanetPerturbationCoefs.Ms)
              + 0.023 * UnitConversion.DEG2RADEC * Math.sin(2 * PlanetPerturbationCoefs.Mj - 3 * PlanetPerturbationCoefs.Ms + 52 * UnitConversion.DEG2RADEC)
              - 0.016 * UnitConversion.DEG2RADEC * Math.sin(PlanetPerturbationCoefs.Mj - 5 * PlanetPerturbationCoefs.Ms - 69 * UnitConversion.DEG2RADEC);
    }
  }
};

