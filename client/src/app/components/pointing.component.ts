import { Component } from '@angular/core';

@Component({
  selector: 'pointing-component',
  template: `
    <h2>Pointing</h2>

    <planetarium-component></planetarium-component>
    <mat-sidenav-container class="right-sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="right-sidenav">
        <catalog-search-component (onObjectSelected)="onObjectSelected($event)"></catalog-search-component>
        <radec-form-component></radec-form-component>
      </mat-sidenav>
    </mat-sidenav-container>
  `,
  styleUrls: ['./pointing.component.css']
})
export class PointingComponent {

  onObjectSelected($event): void {
    console.log($event);
  }

}
