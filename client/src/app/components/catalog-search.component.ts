import { Component, Output, EventEmitter } from '@angular/core';
import objects from '../../assets/catalog1.json';

@Component({
  selector: 'catalog-search-component',
  template: `
    <mat-form-field>
      <input matInput [(ngModel)]="searchText" placeholder="ie. Rosette, NGC245, M81, Jupiter, etc...">
    </mat-form-field>
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
    for (const key in objects) {
      if (objects.hasOwnProperty(key)) {
        const names = key.split('|');
        names.forEach((name) => {
          const i = {};
          i[name] = objects[key];
          this.pool.push(i);
        });
      }
    }
  }

  getKey(o: object): string {
    return Object.keys(o)[0];
  }

  showSearchResults(): boolean {
    return this.searchText && this.searchText.length > 3;
  }

  onObjectClicked(object: object): void {
    this.onObjectSelected.emit(object[this.getKey(object)]);
  }

}
