import { Pipe, PipeTransform } from '@angular/core';
import { Especialista } from '../classes/usuarios/especialista/especialista';
import { Usuario } from '../classes/usuarios/usuario';

@Pipe({
  name: 'castToEspecialista'
})
export class CastToEspecialistaPipe implements PipeTransform {

  transform(value: Usuario, ...args: unknown[]): Especialista {
    return value as Especialista;
  }

}
