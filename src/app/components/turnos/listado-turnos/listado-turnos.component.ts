import { Component } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-listado-turnos',
  templateUrl: './listado-turnos.component.html',
  styleUrls: ['./listado-turnos.component.sass']
})
export class ListadoTurnosComponent {

  constructor(public usuariosService: UsuarioService) {

  }
}
