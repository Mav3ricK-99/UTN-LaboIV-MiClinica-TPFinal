import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { FiltroTurnos } from '../filtros-turnos/filtros-turnos.component';

@Component({
  selector: 'app-tabla-turnos-especialista',
  templateUrl: './tabla-turnos-especialista.component.html',
  styleUrls: ['./tabla-turnos-especialista.component.sass']
})
export class TablaTurnosEspecialistaComponent implements OnChanges{

  @Input('filtros') filtrosTurnos: FiltroTurnos;

  public turnos$: Observable<any[]>;
  public turnoSeleccionado: Turno;

  constructor(private turnosService: TurnosService) {

    this.turnos$ = this.turnosService.traerMisTurnos();
  }

  seleccionarTurno(turno: Turno) {
    this.turnoSeleccionado = turno;
  }

  aceptarTurno(turno: Turno) {
    this.turnosService.actualizarEstadoTurno(turno, EstadosTurnos.aprobado);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['filtrosTurnos']['firstChange']) {
      this.turnos$ = this.turnosService.traerMisTurnos(changes['filtrosTurnos']['currentValue']);
    }
  }
}
