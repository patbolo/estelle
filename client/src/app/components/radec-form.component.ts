import { Component, OnInit } from '@angular/core';

import { PointingService } from '../services/pointing.service';

@Component({
  selector: 'radec-form-component',
  template: `
    <h3>Ra/Dec</h3>
    <form>
      <label for="ra-field">RA</label>
      <input type="number" name="ra" id="ra-field" [(ngModel)]="ra"/>
      <label for="dec-field">Dec</label>
      <input type="number" name="dec" [(ngModel)]="dec"/>
      <button type="submit" (click)="submitRaDec()">Submit</button>
    </form>
  `,
  providers: [ PointingService ]
})
export class RaDecFormComponent implements OnInit {
  public ra: number;
  public dec: number;

  constructor(
    private pointingService: PointingService,
  ) {}

  ngOnInit(): void {
    this.pointingService.getRaDec().subscribe((response) => {
      this.ra = response[0];
      this.dec = response[1];
    });
  }

  submitRaDec(): void {
    console.log(this.ra);
    console.log(this.dec);
    this.pointingService.postRaDec(this.ra, this.dec).subscribe((response) => {
      console.log(response);
    });
  }

}
