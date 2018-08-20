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
}
