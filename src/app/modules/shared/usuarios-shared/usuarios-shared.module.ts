import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioAltaComponent } from 'src/app/components/usuarios/formulario-alta/formulario-alta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FormularioAltaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FormularioAltaComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuariosSharedModule { }
