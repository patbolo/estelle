import { Injectable } from '@angular/core';

@Injectable()
export class CoordinatesConverterService {

  /*numberish(char3) {
    if ( char3 == "0" || char3 == "1" || char3 == "2" || char3 == "3" || char3 == "4" || char3 == "5" || char3 == "6" ||
      char3 == "7" || char3 == "8" || char3 == "9" || char3 == "." ) {
        return 1;
    }
    return 0;
  }*/

  /**
   * Parses a J2000 right ascension
   * @param val string
   */
  /*parseRA(val) {
    let answer = 0;
    let val2 = 0;
    let times = 15.0 * 3600.0;

    // Skip initial blanks
    while ( (val.length > 0) && (val.indexOf(' ') === 0) ) {
      val = val.substring(1);
    }

    // Special form: initial "+" => degrees, not hours
    if ( (val.length > 0) && (val.indexOf('+') === 0) ) {
      times = 3600.0;
      val = val.substring(1);
    }

    // Special form: degree sign anywhere => degrees not hours
    if ( val.indexOf('?') !== -1 ) {
      times = 3600.0;
    }

    while ( val.length > 0 ) {
      if ( ! this.numberish(val.charAt(0)) ) {
        val = val.substring(1);
        continue;
      }
      // val[0] is numberish
      let coun = 0;
      while ( (coun < val.length) && this.numberish(val.charAt(coun)) ) {
        coun = coun + 1;
      }
      // Have a number in [0..coun)

      val2 = val.substring(0, coun);
      val = val.substring (coun);
      // Have the number in val2 and the rest of the string in val.

      answer = parseFloat(answer) + parseFloat(val2) * times;
      times = times / 60;
    } // big loop pulling numbers
    return answer;
  }*/

  // parseFloat and eval seem to work.  ToNumber fails.

  /**
   * Parses a J2000 declinaison
   * @param val string
   */
  /*parseDec(val) {
    let negative = 0;
    let answer = 0;
    let val2 = 0;
    let times = 3600.0;

    // Skip initial blanks
    while ( (val.length > 0) && (val.indexOf(' ') === 0) ) {
      val = val.substring(1);
    }

    if ( (val.length > 0) && (val.indexOf('-') == 0) ) {
      negative = 1;
      val = val.substring(1);
    }


    while ( val.length > 0 ) {
      if ( ! this.numberish(val.charAt(0)) ){
        val = val.substring(1);
        continue;
      }
      // val[0] is numberish
      let coun = 0;
      while ( (coun < val.length) && this.numberish(val.charAt(coun)) ) {
        coun = coun + 1;
      }
      // Have a number in [0..coun)

      val2 = val.substring(0, coun);
      val = val.substring (coun);
      // Have the number in val2 and the rest of the string in val.

      answer = parseFloat(answer) + parseFloat(val2) * times;
      times = times / 60;
    } // big loop pulling numbers

    if (negative) {
      answer = 0.0 - answer;
    }
    return answer;
  }*/

  // From http://www.robertmartinayers.org/tools/coordinates.html
  /*epochJ2000ToRADec(J2000RA, J2000Dec) {
    const toDegrees = 180.0 / Math.PI;
    const globalJRA = this.parseRA(J2000RA);
    const globalJDec = this.parseDec(J2000Dec);

    const radec1 = new Array (
      (globalJRA / 3600.0) / toDegrees,
      (globalJDec / 3600.0) / toDegrees
    );

    const xradec = radec1;
    console.log(xradec);
  }*/

  rev(x: number): number {
    return  x - Math.floor(x / 360.0) * 360.0;
  }

  frac(x) {
    x = x - Math.floor(x);
    if ( x < 0) {
      x = x + 1.0;
    }
    return x;
  }

  hoursMinutesSeconds(time) {
    const h = Math.floor(time);
    const min = Math.floor(60.0 * this.frac(time));
    const secs = Math.round(60.0 * (60.0 * this.frac(time) - min));

    let str;
    if (min >= 10) {
      str = h + ':' + min;
    } else  {
      str = h + ':0' + min;
    }
    if (secs < 10) {
      str = str + ':0' + secs;
    } else {
      str = str + ':' + secs;
    }
    return ' ' + str;

   }

  getUTCSiderealTimeForJD(jd) {
    let t_eph, ut, MJD0, MJD;

    MJD = jd - 2400000.5;
    MJD0 = Math.floor(MJD);
    ut = (MJD - MJD0) * 24.0;
    t_eph  = (MJD0 - 51544.5) / 36525.0;
    return  6.697374558 + 1.0027379093 * ut + (8640184.812866 + (0.093104 - 0.0000062 * t_eph) * t_eph) * t_eph / 3600.0;
  }

  getLocalSiderealTimeForJD(jd, longitude) {
    const GMST = this.getUTCSiderealTimeForJD(jd);
    const LMST =  24.0 * this.frac((GMST + longitude / 15.0) / 24.0);
    return LMST;
  }

  getJulianDay(d, m, y, u) {
    if (y < 1900) {
      y = y + 1900;
    }
    if (m <= 2) {
      m = m + 12;
      y = y - 1;
    }
    const A = Math.floor(y / 100);
    const JD =  Math.floor(365.25 * ( y + 4716)) + Math.floor(30.6001 * ( m + 1)) + d - 13 - 1524.5 + u / 24.0;
    return JD;
  }

  getLocalSiderealTime(longitude) {
    const now = new Date(/* Date.UTC(2017, 1, 1, 0, 0, 0)*/);
    const ut = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
    return this.getLocalSiderealTimeForJD(this.getJulianDay(now.getUTCDate(), now.getUTCMonth() + 1, now.getUTCFullYear(), ut), longitude);
  }

  getDaysToJ2000(y?, m?, d?, h?, mn?) {
    const now = new Date(/* Date.UTC(2017, 1, 1, 0, 0, 0)*/);
    y = y || now.getUTCFullYear();
    m = m || now.getUTCMonth() + 1;
    d = d || now.getUTCDate();
    h = h || now.getUTCHours();
    mn = mn || now.getUTCMinutes();
    let result = 367 * y;
    result    -= Math.floor(7 * ( y + Math.floor((m + 9) / 12)) / 4);
    result    += Math.floor(275 * m / 9);
    result    += d - 730531.5 + (h + mn / 60) / 24;
    return result;
  }

  getMoonCoordinates(y?, m?, d?, h?, mn?) {
    // - Maths from http://www.stargazing.net/kepler/moon3.html
    // - See also http://www.internetsv.info/MoonCalc.html
    // - https://www.satellite-calculations.com/Satellite/suncalc.htm
    const daysToJ2000 = this.getDaysToJ2000(y, m, d, h, mn); // series.E12
    const T = daysToJ2000 / 36525; // series.E13
    const LPrime = (218.3164591 +
      481267.88134236 * T -
      0.0013268 * Math.pow(T, 2) +
      Math.pow(T, 3) / 538841 -
      Math.pow(T, 4) / 194000) % 360; // series.B17
    const radLPrime = LPrime * Math.PI / 180; // series.C17

    const D = (297.8502042 +
      445267.1115168 * T -
      0.00163 * Math.pow(T, 2) +
      Math.pow(T, 3) / 545868 -
      Math.pow(T, 4) / 113065000) % 360; // series.B18
    const radD = D * Math.PI / 180; // series.C18

    const M = (357.5291092 +
      35999.0502909 * T -
      0.0001536 * Math.pow(T, 2) +
      Math.pow(T, 3) / 24490000) % 360; // series.B19
    const radM = M * Math.PI / 180; // series.C19

    const MPrime = (134.9634114 +
      477198.8676313 * T +
      0.008997 * Math.pow(T, 2) +
      Math.pow(T, 3) / 69699 -
      Math.pow(T, 4) / 14712000) % 360; // series.B20
    const radMPrime = MPrime * Math.PI / 180; // series.C20

    const F = (93.2720993 +
      483202.0175273 * T -
      0.0034029 * Math.pow(T, 2) +
      Math.pow(T, 3) / 3526000 -
      Math.pow(T, 4) / 863310000) % 360; // series.B21
    const radF = F * Math.PI / 180; // series.C21

    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2); // series.B26
    const ESquare = Math.pow(E, 2); // series.B27

    const coefs = [ [0, 0, 1, 0, 6288774, -20905355],
                    [2, 0, -1, 0, 1274027, -3699111],
                    [2, 0, 0, 0, 658314, -2955968],
                    [0, 0, 2, 0, 213618, -569925],
                    [0, 1, 0, 0, -185116, 48888],
                    [0, 0, 0, 2, -114332, -3149],
                    [2, 0, -2, 0, 58793, 246158],
                    [2, -1, -1, 0, 57066, -152138],
                    [2, 0, 1, 0, 53322, -170733],
                    [2, -1, 0, 0, 45758, -204586],
                    [0, 1, -1, 0, -40923, -129620],
                    [1, 0, 0, 0, -34720, 108743],
                    [0, 1, 1, 0, -30383, 104755],
                    [2, 0, 0, -2, 15327, 10321],
                    [0, 0, 1, 2, -12528, 0],
                    [0, 0, 1, -2, 10980, 79661],
                    [4, 0, -1, 0, 10675, -34782],
                    [0, 0, 3, 0, 10034, -23210],
                    [4, 0, -2, 0, 8548, -21636],
                    [2, 1, -1, 0, -7888, 24208],
                    [2, 1, 0, 0, -6766, 30824],
                    [1, 0, -1, 0, -5163, -8379],
                    [1, 1, 0, 0, 4987, -16675],
                    [2, -1, 1, 0, 4036, -12831],
                    [2, 0, 2, 0, 3994, -10445],
                    [4, 0, 0, 0, 3861, -11650],
                    [2, 0, -3, 0, 3665, 14403],
                    [0, 1, -2, 0, -2689, -7003],
                    [2, 0, -1, 2, -2602, 0],
                    [2, -1, -2, 0, 2390, 10056],
                    [1, 0, 1, 0, -2348, 6322],
                    [2, -2, 0, 0, 2236, -9884],
                    [0, 1, 2, 0, -2120, 5751],
                    [0, 2, 0, 0, -2069, 0],
                    [2, -2, -1, 0, 2048, -4950],
                    [2, 0, 1, -2, -1773, 4130],
                    [2, 0, 0, 2, -1595, 0],
                    [4, -1, -1, 0, 1215, -3958],
                    [0, 0, 2, 2, -1110, 0],
                    [3, 0, -1, 0, -892, 3258],
                    [2, 1, 1, 0, -810, 2616],
                    [4, -1, -2, 0, 759, -1897],
                    [0, 2, -1, 0, -713, -2117],
                    [2, 2, -1, 0, -700, 2354],
                    [2, 1, -2, 0, 691, 0],
                    [2, -1, 0, -2, 596, 0],
                    [4, 0, 1, 0, 549, -1423],
                    [0, 0, 4, 0, 537, -1117],
                    [4, -1, 0, 0, 520, -1571],
                    [1, 0, -2, 0, -487, -1739],
                    [2, 1, 0, -2, -399, 0],
                    [0, 0, 2, -2, -381, -4421],
                    [1, 1, 1, 0, 351, 0],
                    [3, 0, -2, 0, -340, 0],
                    [4, 0, -3, 0, 330, 0],
                    [2, -1, 2, 0, 327, 0],
                    [0, 2, 1, 0, -323, 1165],
                    [1, 1, -1, 0, 299, 0],
                    [2, 0, 3, 0, 294, 0],
                    [2, 0, -1, -2, 0, 8752]];
    let totalLTerm = 0;
    coefs.forEach( (coef) => {
      let LEccen; // series.N column
      if (Math.abs(coef[1]) === 1) {
        LEccen = coef[4] * E;
      } else if (Math.abs(coef[1]) === 2) {
        LEccen = coef[4] * ESquare;
      } else {
        LEccen = coef[4];
      }
      let REccen; // series.O column
      if (Math.abs(coef[1]) === 1) {
        REccen = coef[5] * E;
      } else if (Math.abs(coef[1]) === 2) {
        REccen = coef[5] * ESquare;
      } else {
        REccen = coef[5];
      }
      const P = LEccen * Math.sin(coef[0] * radD + coef[1] * radM + coef[2] * radMPrime + coef[3] * radF);
      totalLTerm += P;
    });

    const coefs2 = [
      [0, 0, 0, 1, 5128122],
      [0, 0, 1, 1, 280602],
      [0, 0, 1, -1, 277693],
      [2, 0, 0, -1, 173237],
      [2, 0, -1, 1, 55413],
      [2, 0, -1, -1, 46271],
      [2, 0, 0, 1, 32573],
      [0, 0, 2, 1, 17198],
      [2, 0, 1, -1, 9266],
      [0, 0, 2, -1, 8822],
      [2, -1, 0, -1, 8216],
      [2, 0, -2, -1, 4324],
      [2, 0, 1, 1, 4200],
      [2, 1, 0, -1, -3359],
      [2, -1, -1, 1, 2463],
      [2, -1, 0, 1, 2211],
      [2, -1, -1, -1, 2065],
      [0, 1, -1, -1, -1870],
      [4, 0, -1, -1, 1828],
      [0, 1, 0, 1, -1794],
      [0, 0, 0, 3, -1749],
      [0, 1, -1, 1, -1565],
      [1, 0, 0, 1, -1491],
      [0, 1, 1, 1, -1475],
      [0, 1, 1, -1, -1410],
      [0, 1, 0, -1, -1344],
      [1, 0, 0, -1, -1335],
      [0, 0, 3, 1, 1107],
      [4, 0, 0, -1, 1021],
      [4, 0, -1, 1, 833],
      [0, 0, 1, -3, 777],
      [4, 0, -2, 1, 671],
      [2, 0, 0, -3, 607],
      [2, 0, 2, -1, 596],
      [2, -1, 1, -1, 491],
      [2, 0, -2, 1, -451],
      [0, 0, 3, -1, 439],
      [2, 0, 2, 1, 422],
      [2, 0, -3, -1, 421],
      [2, 1, -1, 1, -366],
      [2, 1, 0, 1, -351],
      [4, 0, 0, 1, 331],
      [2, -1, 1, 1, 315],
      [2, -2, 0, -1, 302],
      [0, 0, 1, 3, -283],
      [2, 1, 1, -1, -229],
      [1, 1, 0, -1, 223],
      [1, 1, 0, 1, 223],
      [0, 1, -2, -1, -220],
      [2, 1, -1, -1, -220],
      [1, 0, 1, 1, -185],
      [2, -1, -2, -1, 181],
      [0, 1, 2, 1, -177],
      [4, 0, -2, -1, 176],
      [4, -1, -1, -1, 166],
      [1, 0, 1, -1, -164],
      [4, 0, 1, -1, 132],
      [1, 0, -1, -1, -119],
      [4, -1, 0, -1, 115],
      [2, -2, 0, 1, 107]
    ];
    let totalBTerm = 0;
    coefs2.forEach( (coef) => {
      let BEccen;
      if (Math.abs(coef[1]) === 1) {
        BEccen = coef[4] * E;
      } else if (Math.abs(coef[1]) === 2) {
        BEccen = coef[4] * ESquare;
      } else {
        BEccen = coef[4];
      }
      const BTerm = BEccen * Math.sin(coef[0] * radD + coef[1] * radM + coef[2] * radMPrime + coef[3] * radF);
      totalBTerm += BTerm;
    });

    const A1 = (119.75 + 131.849 * T) % 360; // series.B22
    const radA1 = A1 * Math.PI / 180; // series.C22
    const LPrimeMinusF = 1962 * Math.sin(radLPrime - radF);
    const A2 = (53.09 + 479264.29 * T) % 360; // series.B23
    const radA2 = A2 * Math.PI / 180;
    const A3 = (313.45 + 481266.484 * T) % 360; // series.B24
    const radA3 = A3 * Math.PI / 180;

    const latFinalTotal = totalBTerm +
      -2235 * Math.sin(radLPrime) +
      382 * Math.sin(radA3) +
      175 * Math.sin(radA1 - radF) +
      175 * Math.sin(radA1 + radF) +
      127 * Math.sin(radLPrime - radMPrime) +
      115 * Math.sin(radLPrime + radMPrime); // series.C46

    const longFinalTotal = totalLTerm +
      3956 * Math.sin(radA1) +
      LPrimeMinusF +
      318 * Math.sin(radA2); // series.C35

    const lambda = LPrime + longFinalTotal / 1000000; // series.E6
    const omega = (125.04452 - 1934.136261 * T) % 360; // nutation.B13
    const radOmega = omega * Math.PI / 180; // nutation.C13
    const meanLongSun = (280.4665 + 36000.7698 * T) % 360; // nutation.B14
    const radMeanLongSun = meanLongSun * Math.PI / 180; // nutation.C14
    const meanLongMoon = (218.3165 + 481267.8813 * T) % 360; // nutation.B15
    const radMeanLongMoon = meanLongMoon * Math.PI / 180; // nutation.C15
    const deltaPhi = -17.2 * Math.sin(radOmega) -
      1.32 * Math.sin(2 * radMeanLongSun) -
      0.23 * Math.sin(2 * radMeanLongMoon) +
      0.21 * Math.sin(2 * radOmega); // nutation.B17
    const degDeltaPhi = deltaPhi / 3600;

    const eclipticOfDate = (84381.448 - 46.815 * T - 0.00059 * Math.pow(T, 2) + 0.001813 * Math.pow(T, 3)) / 3600; // nutation.B12
    const deltaE = 9.2 * Math.cos(radOmega) +
      0.57 * Math.cos(2 * radMeanLongSun) +
      0.1 * Math.cos(2 * radMeanLongMoon) -
      0.09 * Math.cos(2 * radOmega); // nutation.B18
    const degDeltaE = deltaE / 3600; // nutation.C18


    const degBeta = latFinalTotal / 1000000; // nutation.B9


    const trueLambda = lambda + degDeltaPhi; // nutation.B21
    const radTrueLambda = trueLambda * Math.PI / 180; // equatorial.D8
    const sinTrueLambda = Math.sin(radTrueLambda); // equatorial.E8
    const cosTrueLambda = Math.cos(radTrueLambda); // equatorial.F8

    const trueBeta = degBeta + degDeltaE; // equatorial.B9
    const radTrueBeta = trueBeta * Math.PI / 180; // equatorial.D9
    const sinTrueBeta = Math.sin(radTrueBeta); // equatorial.E9
    const cosTrueBeta = Math.cos(radTrueBeta); // equatorial.F9
    const tanTrueBeta = sinTrueBeta / cosTrueBeta; // equatorial.G9

    const trueEcliptic = eclipticOfDate + degDeltaE; // nutation.B23
    const radTrueEcliptic = trueEcliptic * Math.PI / 180; // equatorial.D13
    const sinTrueEcliptic = Math.sin(radTrueEcliptic); // equatorial.E13
    const cosTrueEcliptic = Math.cos(radTrueEcliptic); // equatorial.F13
    const geoAlphaEquatA = sinTrueLambda * cosTrueEcliptic - tanTrueBeta * sinTrueEcliptic;
    const geoAlphaEquatB = cosTrueLambda;
    const geoAlphaEquatTan = geoAlphaEquatA / geoAlphaEquatB;

    let geoAlphaEquatRad; // equatorial.D18
    if (geoAlphaEquatB < 0) {
      geoAlphaEquatRad = Math.PI + Math.atan(geoAlphaEquatTan);
    } else if (geoAlphaEquatA < 0) {
      geoAlphaEquatRad = 2 * Math.PI + Math.atan(geoAlphaEquatTan);
    } else {
      geoAlphaEquatRad = Math.atan(geoAlphaEquatTan);
    }

    const geoDeltaEquatRad = Math.asin(sinTrueBeta * cosTrueEcliptic + cosTrueBeta * sinTrueEcliptic * sinTrueLambda); // equatorial.D19
    return {
      rarad: geoAlphaEquatRad,
      decrad: geoDeltaEquatRad,
      ra: geoAlphaEquatRad * 180 / Math.PI / 15, // input.E9
      dec: geoDeltaEquatRad * 180 / Math.PI // input.E10
    };
  }
}
