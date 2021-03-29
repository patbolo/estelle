import { Component, OnInit } from '@angular/core';

import { PointingService } from '../services/pointing.service';

@Component({
  selector: 'radec-form-component',
  template: `
    <h3>Ra/Dec</h3>
    <mat-form-field>
      <mat-label>RA</mat-label>
      <input matInput type="number" name="ra" id="ra-field" [(ngModel)]="ra"/>
    </mat-form-field>
    <mat-form-field>
      <mat-label>Dec</mat-label>
      <input matInput type="number" name="dec" [(ngModel)]="dec"/>
    </mat-form-field>
    <button mat-raised-button type="submit" (click)="submitRaDec()">Submit</button>
  `,
  providers: [ PointingService ],
  styleUrls: ['./radec-form.component.css']
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
