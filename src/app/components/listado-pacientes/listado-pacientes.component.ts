import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-listado-pacientes',
  templateUrl: './listado-pacientes.component.html',
  styleUrls: ['./listado-pacientes.component.sass'],
  animations: [
    trigger('listadoOcultot', [
      state('mostrar',
        style({ opacity: 1, transform: 'translateY(0px)' })
      ),
      state('oculta',
        style({ opacity: 0.2, transform: 'translateY(+400px)' })
      ),
      transition('oculta => mostrar', [
        animate('0.75s 0s ease')
      ]),
    ])
  ]
})
export class ListadoPacientesComponent implements OnInit {

  mostrarFormulario: string;
  usuarios$: Observable<any[]>;

  listadoOculto: boolean;

  @ViewChild('collapse') collapseableElement: NgbCollapse;

  public isCollapsed = true;

  public usuarioSeleccionado: Usuario;

  constructor(private turnosService: TurnosService, private usuarioService: UsuarioService) {
    this.turnosService.traerIdsMisPacientes().forEach((ids) => {
      this.usuarios$ = this.usuarioService.traerUsuarios(ids)
    });
    this.listadoOculto = true;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.listadoOculto = false;
    }, 1000);
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
