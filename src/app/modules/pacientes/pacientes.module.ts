import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PacientesRoutingModule } from './pacientes-routing.module';
import { ListadoPacientesComponent } from 'src/app/components/listado-pacientes/listado-pacientes.component';
import { UsuariosSharedModule } from '../shared/usuarios-shared/usuarios-shared.module';


@NgModule({
  declarations: [
    ListadoPacientesComponent
  ],
  imports: [
    CommonModule,
    PacientesRoutingModule,
    UsuariosSharedModule,
  ],
  exports: [
    UsuariosSharedModule
  ]
})
export class PacientesModule { }
