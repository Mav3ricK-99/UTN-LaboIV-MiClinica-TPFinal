import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Turno } from 'src/app/classes/turno/turno';
import { TurnosService } from 'src/app/services/turnos/turnos.service';

@Component({
  selector: 'app-tabla-turnos-paciente',
  templateUrl: './tabla-turnos-paciente.component.html',
  styleUrls: ['./tabla-turnos-paciente.component.sass']
})
export class TablaTurnosPacienteComponent {

  public turnos$: Observable<any[]>;
  public turnoSeleccionado: Turno;

  constructor(private turnosService: TurnosService) {

    this.turnos$ = this.turnosService.traerMisTurnos();
  }

  seleccionarTurno(turno: Turno) {
    this.turnoSeleccionado = turno;
  }
}
