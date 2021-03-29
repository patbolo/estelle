import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const USE_MOCK_BACKEND = true;

@Injectable()
export class PointingService {

  constructor(
    private http: HttpClient
  ) {
  }

  getRaDec(): Observable<any> {
    if (USE_MOCK_BACKEND) {
      return of([90, 270]);
    }
    return this.http.get('/mount/radec');
  }

  postRaDec(ra: number, dec: number): Observable<any> {
    return this.http.post('/mount/radec', { ra, dec });
  }
}
