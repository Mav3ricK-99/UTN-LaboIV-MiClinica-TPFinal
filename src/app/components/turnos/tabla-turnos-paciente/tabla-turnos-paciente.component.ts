import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Turno } from 'src/app/classes/turno/turno';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { FiltroTurnos } from '../filtros-turnos/filtros-turnos.component';

@Component({
  selector: 'app-tabla-turnos-paciente',
  templateUrl: './tabla-turnos-paciente.component.html',
  styleUrls: ['./tabla-turnos-paciente.component.sass']
})
export class TablaTurnosPacienteComponent implements OnChanges {

  @Input('filtros') filtrosTurnos: FiltroTurnos;
  public turnos$: Observable<any[]>;
  public turnoSeleccionado: Turno;

  constructor(private turnosService: TurnosService) {

    this.turnos$ = this.turnosService.traerMisTurnos();
  }

  seleccionarTurno(turno: Turno) {
    this.turnoSeleccionado = turno;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['filtrosTurnos']['firstChange']) {
      this.turnos$ = this.turnosService.traerMisTurnos(changes['filtrosTurnos']['currentValue']);
    }
  }
}
