import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterkeys'
})
export class FilterKeysPipe implements PipeTransform {
  transform(items: any, searchText: string): any {
    if(!items) return {};
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      return Object.keys(it)[0].toLowerCase().includes(searchText);
    });
   }
}