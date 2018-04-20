import { Component, Output, EventEmitter } from '@angular/core';
import * as objects from '../../assets/catalog1.json';

@Component({
  selector: 'catalog-search-component',
  template: `
    <input [(ngModel)]="searchText" placeholder="ie. Rosette, NGC245, M81, Jupiter, etc...">
    
    <ul *ngIf="showSearchResults()">
      <li *ngFor="let o of pool | filterkeys : searchText" (click)="onObjectClicked(o)">
        {{getKey(o)}}
      </li>
    </ul>
  `
})
export class CatalogSearchComponent {
  @Output() onObjectSelected = new EventEmitter<string>();
  searchText = '';

  pool = [];

  constructor() {
    for (var key in objects) {
      if (objects.hasOwnProperty(key)) {
        let names = key.split('|');
        names.forEach((name)=>{
          let i = {};
          i[name] = objects[key];
          this.pool.push(i);
        });
      }
    }
  }

  getKey(o:object):string {
    return Object.keys(o)[0];
  }

  showSearchResults():boolean {
    return this.searchText && this.searchText.length > 3;
  }

  onObjectClicked(object: object) {
    this.onObjectSelected.emit(object[this.getKey(object)]);
  }

}
