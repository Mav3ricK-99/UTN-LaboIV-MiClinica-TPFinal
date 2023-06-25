import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Historial } from 'src/app/classes/historial/historial';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { HistorialService } from 'src/app/services/historial/historial.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.sass']
})
export class HistorialComponent implements OnInit, OnChanges {

  @Input('usuario') usuario: Usuario;

  @Input() mostrarImagenPerfil: boolean;

  historiales$: Observable<Historial[]>;

  constructor(private historialService: HistorialService) { }

  ngOnInit(): void {
    this.historiales$ = this.historialService.traerHistorialesUsuario(this.usuario);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.historiales$ = this.historialService.traerHistorialesUsuario(this.usuario);
  }
}
