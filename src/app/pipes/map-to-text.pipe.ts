import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToText'
})
export class MapToTextPipe implements PipeTransform {

  transform(value: object, ...args: unknown[]): string {
    let key = Object.keys(value)[0];
    let value2 = Object.values(value)[0];

    return `${key}: ${value2}`;
  }

}
