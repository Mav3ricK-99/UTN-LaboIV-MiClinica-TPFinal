import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioAltaComponent } from 'src/app/components/usuarios/formulario-alta/formulario-alta.component';
import { FormSharedModule } from '../form-shared/form-shared.module';



@NgModule({
  declarations: [
    FormularioAltaComponent
  ],
  imports: [
    CommonModule,
    FormSharedModule
  ],
  exports: [
    FormularioAltaComponent,
  ]
})
export class UsuariosSharedModule { }
