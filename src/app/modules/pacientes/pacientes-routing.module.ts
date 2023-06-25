import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoPacientesComponent } from 'src/app/components/listado-pacientes/listado-pacientes.component';

const routes: Routes = [{
  path: '',
  component: ListadoPacientesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacientesRoutingModule { }
