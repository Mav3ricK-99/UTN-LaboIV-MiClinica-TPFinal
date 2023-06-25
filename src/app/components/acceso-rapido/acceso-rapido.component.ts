import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-acceso-rapido',
  templateUrl: './acceso-rapido.component.html',
  styleUrls: ['./acceso-rapido.component.sass']
})
export class AccesoRapidoComponent {

  public isCollapsed = true;

  public usuarios$: Observable<any[]>;

  constructor(private usuariosService: UsuarioService, private router: Router) {

    this.usuarios$ = this.usuariosService.traerTodos();
  }

  ingresarCon(usuario: Usuario) {
    this.usuariosService.ingresarUsuario(usuario.email, 'federico').then(() => {
      this.router.navigate(['/']);
    });
  }
}
