import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { FiltroTurnos } from '../filtros-turnos/filtros-turnos.component';

@Component({
  selector: 'app-tabla-turnos-administrador',
  templateUrl: './tabla-turnos-administrador.component.html',
  styleUrls: ['./tabla-turnos-administrador.component.sass']
})
export class TablaTurnosAdministradorComponent implements OnChanges {

  @Input('filtros') filtrosTurnos: FiltroTurnos;

  public turnos$: Observable<any[]>;
  public turnoSeleccionado: Turno;

  constructor(private turnosService: TurnosService) {
    this.turnos$ = this.turnosService.traerTodos();
  }

  seleccionarTurno(turno: Turno) {
    this.turnoSeleccionado = turno;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['filtrosTurnos']['firstChange']) {
      this.turnos$ = this.turnosService.traerTodos(changes['filtrosTurnos']['currentValue']);
    }
  }
}
