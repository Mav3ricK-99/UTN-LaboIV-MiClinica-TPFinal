import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import Swal from 'sweetalert2';
import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from 'src/app/classes/usuarios/usuario';

@Component({
  selector: 'app-formulario-alta',
  templateUrl: './formulario-alta.component.html',
  styleUrls: ['./formulario-alta.component.sass']
})
export class FormularioAltaComponent {

  @Input('mostrarFormulario') mostrarFormulario: string

  formularioRegistroPaciente: FormGroup;
  formularioRegistroEspecialista: FormGroup;
  formularioRegistroAdministrador: FormGroup;

  mostrarNuevaEsp: boolean;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private router: Router) {

    this.mostrarNuevaEsp = false;
    this.formularioRegistroPaciente = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99)]),
      documento: new FormControl('', [Validators.required, Validators.min(4000000), Validators.max(99999999)]),
      obraSocial: new FormControl('', [Validators.required, Validators.minLength(3)]),
      nroAfiliado: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repetirContraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    this.formularioRegistroEspecialista = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99)]),
      documento: new FormControl('', [Validators.required, Validators.min(4000000), Validators.max(99999999)]),
      //especialidad: new FormControl('', [Validators.required, Validators.minLength(6)]),
      nroMatricula: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repetirContraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    this.formularioRegistroAdministrador = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99)]),
      documento: new FormControl('', [Validators.required, Validators.min(4000000), Validators.max(99999999)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repetirContraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  registrarPaciente() {
    if (!this.formularioRegistroPaciente.valid) return;

    let nombre = this.formularioRegistroPaciente.get('nombre')?.value;
    nombre += this.formularioRegistroPaciente.get('apellido')?.value;

    let edad = this.formularioRegistroPaciente.get('edad')?.value;
    let dni = this.formularioRegistroPaciente.get('documento')?.value;
    let obraSocial = this.formularioRegistroPaciente.get('obraSocial')?.value;
    let nroAfiliado = this.formularioRegistroPaciente.get('nroAfiliado')?.value;
    let email = this.formularioRegistroPaciente.get('email')?.value;

    let password = this.formularioRegistroPaciente.get('contraseña')?.value;

    let nuevoPaciente = new Paciente("0", nombre, dni, edad, email, obraSocial, nroAfiliado);

    this.usuarioService.registrarUsuario(nuevoPaciente, password).then(() => {
      this.mostrarModal('Paciente agregado', 'success', 'Un nuevo paciente se agrego al sistema!');
    });
  }

  registrarEspecialista() {
    if (!this.formularioRegistroEspecialista.valid) return;

    let nombre = this.formularioRegistroEspecialista.get('nombre')?.value;
    nombre += " " + this.formularioRegistroEspecialista.get('apellido')?.value;

    let edad = this.formularioRegistroEspecialista.get('edad')?.value;
    let dni = this.formularioRegistroEspecialista.get('documento')?.value;
    let especialidad = this.formularioRegistroEspecialista.get('especialidad')?.value;
    let nroMatricula = this.formularioRegistroEspecialista.get('nroMatricula')?.value;
    let email = this.formularioRegistroEspecialista.get('email')?.value;

    let password = this.formularioRegistroEspecialista.get('contraseña')?.value;

    let nuevoEspecialista = new Especialista("0", nombre, dni, edad, email, especialidad, nroMatricula);

    this.usuarioService.registrarUsuario(nuevoEspecialista, password).then(() => {
      this.mostrarModal('Especialista agregado', 'success', 'Un nuevo especialista se agrego al sistema!');
    });
  }

  registrarAdministrador() {
    if (!this.formularioRegistroAdministrador.valid) return;

    let nombre = this.formularioRegistroAdministrador.get('nombre')?.value;
    nombre += " " + this.formularioRegistroAdministrador.get('apellido')?.value;

    let edad = this.formularioRegistroAdministrador.get('edad')?.value;
    let dni = this.formularioRegistroAdministrador.get('documento')?.value;
    let email = this.formularioRegistroAdministrador.get('email')?.value;

    let password = this.formularioRegistroAdministrador.get('contraseña')?.value;

    let nuevoAdministrador = new Usuario("0", nombre, dni, edad, email);
    nuevoAdministrador.tipoUsuario = 'admin';

    this.usuarioService.registrarUsuario(nuevoAdministrador, password).then(() => {
      this.mostrarModal('Administrador agregado', 'success', 'Un nuevo administrador se agrego al sistema!');
    });
  }

  limpiarFormulario() {
    this.formularioRegistroEspecialista.reset();
    this.formularioRegistroPaciente.reset();
    this.formularioRegistroAdministrador.reset();
  }

  mostrarModal(titulo: string, icon: string, textoCuerpo: string) {
    if (icon != 'success' && icon != 'error') return;
    Swal.fire({
      title: titulo,
      icon: icon,
      text: textoCuerpo,
      confirmButtonText: 'BIEN!',
    }).then(() => {
      this.formularioRegistroEspecialista.reset();
      this.formularioRegistroPaciente.reset();
    })
  }
}
