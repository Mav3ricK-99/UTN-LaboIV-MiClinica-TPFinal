import { Component } from '@angular/core';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.sass']
})
export class PerfilComponent {

  public usuario: Usuario;
  constructor(private usuariosService: UsuarioService) {
    if (usuariosService.usuarioIngresado) {
      this.usuario = usuariosService.usuarioIngresado;
    }
  }
}
