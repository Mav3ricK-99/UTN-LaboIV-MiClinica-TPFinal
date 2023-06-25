import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla-usuarios.component.html',
  styleUrls: ['./tabla-usuarios.component.sass']
})
export class TablaUsuariosComponent {

  @Input() usuarios$: Observable<Usuario[]>;

  @Input() soloTipoUsuario: string;

  @Output() eligioUsuario = new EventEmitter<Usuario>();

  constructor(private usuariosService: UsuarioService) { }

  seleccionarUsuario($event: any) {
    this.eligioUsuario.emit($event);
  }

  habilitarCuenta(usuario: Usuario) {
    this.usuariosService.habilitarCuenta(usuario.uid, !usuario.cuentaHabilitada);
  }
}
