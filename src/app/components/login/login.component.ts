import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  formularioIngreso: FormGroup;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private router: Router) {

    this.formularioIngreso = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      contraseña: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ingresar() {
    if (!this.formularioIngreso.valid) return;

    let email = this.formularioIngreso.get('email')?.value;
    let password = this.formularioIngreso.get('contraseña')?.value;

    this.usuarioService.ingresarUsuario(email, password).then(() => {
      this.router.navigate(['/']);
    }).catch((error) => {
      switch (error.code) {
        case "auth/user-not-found": {
          this.formularioIngreso.controls['contraseña'].setErrors({
            'invalid': true
          })
        }; break;
        case "auth/wrong-password": {
          this.formularioIngreso.controls['contraseña'].setErrors({
            'invalid': true
          })
        }; break;
        case "auth/login-blocked": {
          this.formularioIngreso.controls['contraseña'].setErrors({
            'unverified': true
          })
        }; break;
      }
    });
  }
}
