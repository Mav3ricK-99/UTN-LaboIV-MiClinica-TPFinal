import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {

  mostrarFormulario: string;

  constructor() {
    this.mostrarFormulario = 'pacientes';
  }

  cambiarFormulario(formulario: string) {
    this.mostrarFormulario = formulario;
  }
}
