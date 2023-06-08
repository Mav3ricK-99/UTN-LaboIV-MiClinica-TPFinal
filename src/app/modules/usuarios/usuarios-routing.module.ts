import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoUsuariosComponent } from 'src/app/components/listado-usuarios/listado-usuarios.component';

const routes: Routes = [{
  path: '',
  component: ListadoUsuariosComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
