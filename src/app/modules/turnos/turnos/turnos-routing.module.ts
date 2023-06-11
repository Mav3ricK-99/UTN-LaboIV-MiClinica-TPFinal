import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoTurnosComponent } from 'src/app/components/turnos/listado-turnos/listado-turnos.component';

const routes: Routes = [{
  path: '',
  component: ListadoTurnosComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosRoutingModule { }
