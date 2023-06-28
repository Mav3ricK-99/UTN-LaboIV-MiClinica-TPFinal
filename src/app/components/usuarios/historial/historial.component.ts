import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { TurnosService } from 'src/app/services/turnos/turnos.service';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.sass']
})
export class HistorialComponent implements OnInit, OnChanges {

  @Input('usuario') usuario: Usuario;

  @Input() mostrarImagenPerfil: boolean;

  @Input() especialidad?: string;

  turnos$: Observable<Turno[]>;

  constructor(private turnosService: TurnosService) { }

  ngOnInit(): void {
    this.turnos$ = this.turnosService.traerTurnosUsuario(this.usuario, EstadosTurnos.finalizado);
  }

  ngOnChanges(changes: SimpleChanges): void {
    /* if (changes['especialidad']) {
      let especialidad = changes['especialidad'].currentValue;
      this.turnos$ = this.turnosService.traerTurnosUsuario(this.usuario, EstadosTurnos.finalizado, especialidad);
    } else {
    } */
    this.turnos$ = this.turnosService.traerTurnosUsuario(this.usuario, EstadosTurnos.finalizado);
  }
}
