import { Component } from '@angular/core';

@Component({
  selector: 'pointing-component',
  template: `
    <h2>Pointing</h2>
    <catalog-search-component (onObjectSelected)="onObjectSelected($event)"></catalog-search-component>
    <planetarium-component></planetarium-component>
  `
})
export class PointingComponent {

  onObjectSelected($event) {
    console.log($event);
  }
  
}
