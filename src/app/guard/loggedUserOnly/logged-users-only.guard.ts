import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

export const loggedUsersOnlyGuard: CanActivateFn = (route, state) => {
  return !inject(UsuarioService).hayUsuarioIngresado() ? inject(Router).parseUrl('') : true;
};
