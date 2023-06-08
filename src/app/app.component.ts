import { Component } from '@angular/core';
import { UsuarioService } from './services/usuarios/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'MiClinica';

  constructor(private usuariosService: UsuarioService) {}
}
