import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { ListadoUsuariosComponent } from 'src/app/components/listado-usuarios/listado-usuarios.component';
import { TablaUsuariosComponent } from 'src/app/components/tabla-usuarios/tabla-usuarios.component';
import { CastToEspecialistaPipe } from 'src/app/pipes/cast-to-especialista.pipe';
import { CastToPacientePipe } from 'src/app/pipes/cast-to-paciente.pipe';
import { UsuariosSharedModule } from '../shared/usuarios-shared/usuarios-shared.module';


@NgModule({
  declarations: [
    ListadoUsuariosComponent,
    TablaUsuariosComponent,
    CastToEspecialistaPipe,
    CastToPacientePipe,
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    UsuariosSharedModule
  ]
})
export class UsuariosModule { }
