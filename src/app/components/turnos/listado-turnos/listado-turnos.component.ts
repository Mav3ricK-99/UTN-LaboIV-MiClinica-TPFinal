import { Component, Input } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import { FiltroTurnos } from '../filtros-turnos/filtros-turnos.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-listado-turnos',
  templateUrl: './listado-turnos.component.html',
  styleUrls: ['./listado-turnos.component.sass'],
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
export class ListadoTurnosComponent {

  filtroTurnos: FiltroTurnos;
  listadoOculto: boolean;

  constructor(public usuariosService: UsuarioService) {
    this.listadoOculto = true;
  }

  filtrar($event: any) {
    this.filtroTurnos = $event;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.listadoOculto = false;
    }, 1000);
  }
}
