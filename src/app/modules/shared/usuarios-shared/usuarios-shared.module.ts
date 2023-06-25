import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioAltaComponent } from 'src/app/components/usuarios/formulario-alta/formulario-alta.component';
import { FormSharedModule } from '../form-shared/form-shared.module';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from "ng-recaptcha";
import { CastToEspecialistaPipe } from 'src/app/pipes/cast-to-especialista.pipe';
import { CastToPacientePipe } from 'src/app/pipes/cast-to-paciente.pipe';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { HistorialComponent } from 'src/app/components/usuarios/historial/historial.component';
import { MapToTextPipe } from 'src/app/pipes/map-to-text.pipe';
import { TablaUsuariosComponent } from 'src/app/components/tabla-usuarios/tabla-usuarios.component';
@NgModule({
  declarations: [
    TablaUsuariosComponent,
    FormularioAltaComponent,
    CastToEspecialistaPipe,
    CastToPacientePipe,
    HistorialComponent,
    MapToTextPipe,
  ],
  imports: [
    CommonModule,
    FormSharedModule,
    RecaptchaV3Module,
    NgbCollapseModule
  ],
  exports: [
    TablaUsuariosComponent,
    FormularioAltaComponent,
    CastToEspecialistaPipe,
    CastToPacientePipe,
    NgbCollapseModule,
    HistorialComponent,
    MapToTextPipe,
  ],
  providers: [{ provide: RECAPTCHA_V3_SITE_KEY, useValue: "6LegNcAmAAAAAF3w556bvCbH6MXcQAfFHQbASkcq" }]
})
export class UsuariosSharedModule { }
