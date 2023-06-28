import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  return !inject(UsuarioService).usuarioIngresado?.isAdmin() ? inject(Router).parseUrl('/') : true;
};
