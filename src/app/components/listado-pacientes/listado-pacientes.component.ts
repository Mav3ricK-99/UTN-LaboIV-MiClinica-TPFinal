import { Component, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-listado-pacientes',
  templateUrl: './listado-pacientes.component.html',
  styleUrls: ['./listado-pacientes.component.sass']
})
export class ListadoPacientesComponent {

  mostrarFormulario: string;
  usuarios$: Observable<any[]>;

  @ViewChild('collapse') collapseableElement: NgbCollapse;

  public isCollapsed = true;

  public usuarioSeleccionado: Usuario;

  constructor(private turnosService: TurnosService, private usuarioService: UsuarioService) {
    this.turnosService.traerIdsMisPacientes().forEach((ids) => {
      this.usuarios$ = this.usuarioService.traerUsuarios(ids)
    });
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
