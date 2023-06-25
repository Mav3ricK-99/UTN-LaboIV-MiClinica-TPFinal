import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { isAdminGuard } from './guard/permisos/is-admin.guard';
import { PerfilComponent } from './components/usuarios/perfil/perfil.component';

const routes: Routes = [
  {
    path: 'ingresar',
    component: LoginComponent,
    title: 'MiClinica - Ingreso usuarios'
  },
  {
    path: 'registro',
    component: RegisterComponent,
    title: 'MiClinica - Registro usuarios'
  },
  {
    path: 'perfil',
    component: PerfilComponent,
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [isAdminGuard]
  },
  {
    path: 'pacientes',
    loadChildren: () => import('./modules/pacientes/pacientes.module').then(m => m.PacientesModule),
  },
  {
    path: 'turnos',
    loadChildren: () => import('./modules/turnos/turnos/turnos.module').then(m => m.TurnosModule),
    //canActivate: [isAdminGuard]
  },
  {
    path: '',
    component: HomeComponent,
    title: 'MiClinica - Pagina principal'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
