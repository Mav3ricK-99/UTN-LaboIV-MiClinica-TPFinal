import { Pipe, PipeTransform } from '@angular/core';
import { Paciente } from '../classes/usuarios/paciente/paciente';

@Pipe({
  name: 'castToPaciente'
})
export class CastToPacientePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): Paciente {
    return value as Paciente;
  }

}
