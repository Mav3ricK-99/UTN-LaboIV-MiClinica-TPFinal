import { Component, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import { FiltroTurnos } from '../filtros-turnos/filtros-turnos.component';

@Component({
  selector: 'app-listado-turnos',
  templateUrl: './listado-turnos.component.html',
  styleUrls: ['./listado-turnos.component.sass']
})
export class ListadoTurnosComponent {

  filtroTurnos: FiltroTurnos;

  constructor(public usuariosService: UsuarioService) { }

  filtrar($event: any) {
    this.filtroTurnos = $event;
  }
}
