import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioAltaComponent } from 'src/app/components/usuarios/formulario-alta/formulario-alta.component';
import { FormSharedModule } from '../form-shared/form-shared.module';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";
@NgModule({
  declarations: [
    FormularioAltaComponent
  ],
  imports: [
    CommonModule,
    FormSharedModule,
    RecaptchaV3Module
  ],
  exports: [
    FormularioAltaComponent,
  ],
  providers: [{ provide: RECAPTCHA_V3_SITE_KEY, useValue: "6LegNcAmAAAAAF3w556bvCbH6MXcQAfFHQbASkcq" }]
})
export class UsuariosSharedModule { }
