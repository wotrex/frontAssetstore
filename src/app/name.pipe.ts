import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(positions: any, search: any): any {

    //check if search term is undefined
    if(search === undefined) return positions;
    //return updates people array
    return positions.filter(function(thisperson){
        return thisperson.name.toLowerCase().includes(search.toLowerCase());
    }) 

  }

}