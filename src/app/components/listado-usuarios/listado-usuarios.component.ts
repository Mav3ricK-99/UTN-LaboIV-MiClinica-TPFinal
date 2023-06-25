import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.sass']
})
export class ListadoUsuariosComponent {

  mostrarFormulario: string;
  usuarios$: Observable<any[]>;

  @ViewChild('collapse') collapseableElement: NgbCollapse;

  public isCollapsed = true;

  public usuarioSeleccionado: Usuario;

  constructor(private usuariosService: UsuarioService) {
    this.usuarios$ = this.usuariosService.traerTodos();

    this.mostrarFormulario = 'pacientes';
  }

  cambiarFormulario(formulario: string) {
    this.mostrarFormulario = formulario;
  }

  mostrarHistorialUsuario($event: any) {
    let hacerToggle = false;
    if ($event == this.usuarioSeleccionado || this.usuarioSeleccionado == undefined) {
      hacerToggle = true;
    }
    this.usuarioSeleccionado = $event;
    if (hacerToggle) {
      this.collapseableElement.toggle();
    }
  }
}
