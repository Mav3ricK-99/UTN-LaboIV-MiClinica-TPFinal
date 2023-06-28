import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {

  mostrarFormulario: string;

  constructor() {
  }

  cambiarFormulario(formulario: string) {
    this.mostrarFormulario = formulario;
  }
}
