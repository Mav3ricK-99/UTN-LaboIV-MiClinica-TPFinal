import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { TurnosService } from 'src/app/services/turnos/turnos.service';

@Component({
  selector: 'app-tabla-turnos-administrador',
  templateUrl: './tabla-turnos-administrador.component.html',
  styleUrls: ['./tabla-turnos-administrador.component.sass']
})
export class TablaTurnosAdministradorComponent {

  public turnos$: Observable<any[]>;
  public turnoSeleccionado: Turno;

  constructor(private turnosService: TurnosService) {

    this.turnos$ = this.turnosService.traerTodos();
  }

  seleccionarTurno(turno: Turno) {
    this.turnoSeleccionado = turno;
  }
}
