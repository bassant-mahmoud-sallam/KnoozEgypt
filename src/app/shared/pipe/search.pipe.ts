import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(arrayofData:any[] , textSearch:string): any[] {
    return arrayofData.filter((itemObject) => itemObject.name.toLowerCase().includes(textSearch.toLowerCase()));
  }

}
