import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

export const guestsOnlyGuard: CanActivateFn = (route, state) => {
  return !inject(UsuarioService).hayUsuarioIngresado();
};
