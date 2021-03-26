import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PointingService {

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * Fetch offerings details having name, info and _id
   * @return IClassConsoleOfferingsResponse
   */
  getRaDec(): Observable<any> {
    return this.http.get('/mount/radec');
  }

  postRaDec(ra: number, dec: number): Observable<any> {
    return this.http.post('/mount/radec', { ra, dec });
  }
}
