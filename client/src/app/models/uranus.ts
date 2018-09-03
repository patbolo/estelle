import { IPlanetaryOrbitalElements, PlanetPerturbationCoefs } from './planet';
import { UnitConversion } from '../services/coordinates-converter.service';

export const UranusOrbitalElements: IPlanetaryOrbitalElements = {
  N1: 74.0005, // LongAscNode
  N2: 1.3978E-5, // LongAscNode
  I1: 0.7733, // Inclination
  I2: 1.9E-8, // Inclination
  W1: 96.6612, // ArgOfPerigee
  W2: 3.0565E-5, // ArgOfPerigee
  A: 19.18171, // Mean distance
  E1: 0.047318, // Eccentricity
  E2: 7.45E-9, // Eccentricity
  M1: 142.5905, // Mean anomaly
  M2: 0.011725806, // Mean anomaly

  perturbations: {
    longitude: () => {
      return  + 0.040 * UnitConversion.DEG2RADEC * Math.sin(PlanetPerturbationCoefs.Ms - 2 * PlanetPerturbationCoefs.Mu + 6 * UnitConversion.DEG2RADEC)
              + 0.035 * UnitConversion.DEG2RADEC * Math.sin(PlanetPerturbationCoefs.Ms - 3 * PlanetPerturbationCoefs.Mu + 33 * UnitConversion.DEG2RADEC)
              - 0.015 * UnitConversion.DEG2RADEC * Math.sin(PlanetPerturbationCoefs.Mj - PlanetPerturbationCoefs.Mu + 20 * UnitConversion.DEG2RADEC);
    }
  }
};

