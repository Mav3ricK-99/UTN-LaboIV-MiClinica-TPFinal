import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Especialidades, Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import Swal from 'sweetalert2';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { ReCaptchaV3Service, OnExecuteErrorData } from "ng-recaptcha";
import { Observable, OperatorFunction, Subject, Subscription, debounceTime, distinctUntilChanged, filter, map, merge } from 'rxjs';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-formulario-alta',
  templateUrl: './formulario-alta.component.html',
  styleUrls: ['./formulario-alta.component.sass']
})
export class FormularioAltaComponent implements OnDestroy, OnInit {

  private subscription: Subscription;
  private reCaptchav3Token: string;

  @Input('mostrarFormulario') mostrarFormulario: string;

  formularioRegistroPaciente: FormGroup;
  formularioRegistroEspecialista: FormGroup;
  formularioRegistroAdministrador: FormGroup;

  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  @ViewChild('selectEsp', { static: true }) selectEsp: NgbTypeahead;

  mostrarNuevaEsp: boolean;

  constructor(private recaptchaV3Service: ReCaptchaV3Service, private formBuilder: FormBuilder, private usuarioService: UsuarioService, private router: Router) {

    this.mostrarNuevaEsp = false;
    this.formularioRegistroPaciente = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99)]),
      documento: new FormControl('', [Validators.required, Validators.min(4000000), Validators.max(99999999)]),
      obraSocial: new FormControl('', [Validators.required, Validators.minLength(3)]),
      nroAfiliado: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email]),
      imagenPerfil: new FormControl<File | null>(null, [Validators.required]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repetirContraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, { validators: [this.validarContraseñas(), this.validarFormatoImagenPerfil()] });

    this.formularioRegistroEspecialista = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99)]),
      documento: new FormControl('', [Validators.required, Validators.min(4000000), Validators.max(99999999)]),
      especialidad: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      nroMatricula: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email]),
      imagenPerfil: new FormControl<File | null>(null, [Validators.required]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repetirContraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, { validators: [this.validarContraseñas(), this.validarFormatoImagenPerfil()] });

    this.formularioRegistroAdministrador = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99)]),
      documento: new FormControl('', [Validators.required, Validators.min(4000000), Validators.max(99999999)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      imagenPerfil: new FormControl<File | null>(null, [Validators.required]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
      repetirContraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
    }, { validators: [this.validarContraseñas(), this.validarFormatoImagenPerfil()] });
  }

  public ngOnInit() {
    this.subscription = this.recaptchaV3Service.onExecuteError.subscribe((data: OnExecuteErrorData) => {
      console.error("bots not allowed" + data);
    });
  }

  validarContraseñas(): ValidatorFn {
    return (formulario: AbstractControl): ValidationErrors | null => {
      let ctrlContraseña = formulario.get('contraseña');
      let ctrlRepetirContraseña = formulario.get('repetirContraseña');
      if (ctrlRepetirContraseña?.value != ctrlContraseña?.value) {
        return {
          noCoinciden: true,
        }
      }
      return null;
    };
  }

  validarFormatoImagenPerfil(): ValidatorFn {
    return (formulario: AbstractControl): ValidationErrors | null => {
      let ctrlInputImagenPerfil = formulario.get('imagenPerfil');
      let tipoArchivo: string = ctrlInputImagenPerfil?.value?.type;
      let errores: any = {};
      if (tipoArchivo != undefined) {
        if (!tipoArchivo.includes("image/")) {
          errores.formatoIncorrecto = true
        }
        if ((ctrlInputImagenPerfil?.value.size / 100000) > 10) {
          errores.excedioTamaño = true
        }
        return errores;
      }
      return null;
    };
  }

  buscarEspecialidad: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : Object.values(Especialidades).filter((v: string) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );

  registrarPaciente() {
    this.recaptchaV3Service.execute('registrarUsuario')
      .subscribe((token) => { this.reCaptchav3Token = token; });

    if (!this.formularioRegistroPaciente.valid || !this.reCaptchav3Token) return;

    let nombre = this.formularioRegistroPaciente.get('nombre')?.value;
    nombre += " " + this.formularioRegistroPaciente.get('apellido')?.value;

    let edad = this.formularioRegistroPaciente.get('edad')?.value;
    let dni = this.formularioRegistroPaciente.get('documento')?.value;
    let obraSocial = this.formularioRegistroPaciente.get('obraSocial')?.value;
    let nroAfiliado = this.formularioRegistroPaciente.get('nroAfiliado')?.value;
    let email = this.formularioRegistroPaciente.get('email')?.value;

    let password = this.formularioRegistroPaciente.get('contraseña')?.value;
    const imagenPerfil = this.formularioRegistroPaciente.get('imagenPerfil')?.value;

    let nuevoPaciente = new Paciente("0", nombre, dni, edad, email, true, obraSocial, nroAfiliado);
    this.usuarioService.registrarUsuario(nuevoPaciente, password).then((res: any) => {
      this.mostrarModal('Paciente agregado', 'success', 'Un nuevo paciente se agrego al sistema!. Recorda que ahora estas ingresado como este usuario');
      this.usuarioService.subirFotoUsuario(res.user.uid, imagenPerfil);
      if (!this.usuarioService.usuarioIngresado?.isAdmin) {
        this.router.navigateByUrl('/');
      }
    }).catch((error) => {
      if (error.code == 'auth/email-already-in-use') {
        this.formularioRegistroPaciente.controls['email'].setErrors({
          'invalid': true
        });
      }
    });
  }

  registrarEspecialista() {
    this.recaptchaV3Service.execute('registrarUsuario')
      .subscribe((token) => { this.reCaptchav3Token = token; });

    if (!this.formularioRegistroEspecialista.valid || !this.reCaptchav3Token) return;

    let nombre = this.formularioRegistroEspecialista.get('nombre')?.value;
    nombre += " " + this.formularioRegistroEspecialista.get('apellido')?.value;

    let edad = this.formularioRegistroEspecialista.get('edad')?.value;
    let dni = this.formularioRegistroEspecialista.get('documento')?.value;
    let ctrlEspecialidad = this.formularioRegistroEspecialista.get('especialidad');
    let valueEspecialidad: string[] = [];
    if (ctrlEspecialidad) {
      valueEspecialidad.push(ctrlEspecialidad.value);
    }
    let nroMatricula = this.formularioRegistroEspecialista.get('nroMatricula')?.value;
    let email = this.formularioRegistroEspecialista.get('email')?.value;

    let password = this.formularioRegistroEspecialista.get('contraseña')?.value;
    const imagenPerfil = this.formularioRegistroEspecialista.get('imagenPerfil')?.value;
    let nuevoEspecialista = new Especialista("0", nombre, dni, edad, email, true, valueEspecialidad, nroMatricula);

    
    this.usuarioService.registrarUsuario(nuevoEspecialista, password).then((res: any) => {
      this.mostrarModal('Especialista agregado', 'success', 'Un nuevo especialista se agrego al sistema!. Recorda que ahora estas ingresado como este usuario');
      this.usuarioService.subirFotoUsuario(res.user.uid, imagenPerfil);
    }).catch((error) => {
      if (error.code == 'auth/email-already-in-use') {
        this.formularioRegistroEspecialista.controls['email'].setErrors({
          'invalid': true
        });
      }
    });
  }

  registrarAdministrador() {
    this.recaptchaV3Service.execute('registrarUsuario')
      .subscribe((token) => { this.reCaptchav3Token = token; });

    if (!this.formularioRegistroAdministrador.valid || !this.reCaptchav3Token) return;

    let nombre = this.formularioRegistroAdministrador.get('nombre')?.value;
    nombre += " " + this.formularioRegistroAdministrador.get('apellido')?.value;

    let edad = this.formularioRegistroAdministrador.get('edad')?.value;
    let dni = this.formularioRegistroAdministrador.get('documento')?.value;
    let email = this.formularioRegistroAdministrador.get('email')?.value;

    let password = this.formularioRegistroAdministrador.get('contraseña')?.value;
    const imagenPerfil = this.formularioRegistroAdministrador.get('imagenPerfil')?.value;

    let nuevoAdministrador = new Usuario("0", nombre, dni, edad, email);
    nuevoAdministrador.tipoUsuario = 'admin';

    this.usuarioService.registrarUsuario(nuevoAdministrador, password).then((res: any) => {
      this.mostrarModal('Administrador agregado', 'success', 'Un nuevo administrador se agrego al sistema!. Recorda que ahora estas ingresado como este usuario');
      this.usuarioService.subirFotoUsuario(res.user.uid, imagenPerfil);
    }).catch((error) => {
      if (error.code == 'auth/email-already-in-use') {
        this.formularioRegistroAdministrador.controls['email'].setErrors({
          'invalid': true
        });
      }
    });
  }

  limpiarFormulario() {
    this.formularioRegistroEspecialista.reset();
    this.formularioRegistroPaciente.reset();
    this.formularioRegistroAdministrador.reset();
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

  subioImagenPerfil(archivo: File | null, formulario: string) {
    if (archivo instanceof File) {
      switch (formulario) {
        case 'paciente': {
          this.formularioRegistroPaciente.patchValue({
            imagenPerfil: archivo
          });
        }; break;
        case 'especialista': {
          this.formularioRegistroEspecialista.patchValue({
            imagenPerfil: archivo
          });
        }; break;
        case 'administrador': {
          this.formularioRegistroAdministrador.patchValue({
            imagenPerfil: archivo
          });
        }; break;
      }

    }

  }
}
