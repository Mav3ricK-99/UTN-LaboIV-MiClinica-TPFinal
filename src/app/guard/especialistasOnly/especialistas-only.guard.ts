import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

export const especialistasOnlyGuard: CanActivateFn = (route, state) => {
  return !inject(UsuarioService) || inject(UsuarioService).usuarioIngresado?.tipoUsuario != 'especialista' ? inject(Router).parseUrl('/') : true;
};
