import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.sass']
})
export class ListadoUsuariosComponent {

  mostrarFormulario: string;
  usuarios$: Observable<any[]>;

  constructor(private usuariosService: UsuarioService) {
    this.usuarios$ = this.usuariosService.traerTodos();

    this.mostrarFormulario = 'pacientes';
  }

  cambiarFormulario(formulario: string) {
    this.mostrarFormulario = formulario;
  }
}
