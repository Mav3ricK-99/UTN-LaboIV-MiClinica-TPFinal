import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { isAdminGuard } from './guard/isAdmin/is-admin.guard';
import { PerfilComponent } from './components/usuarios/perfil/perfil.component';
import { loggedUsersOnlyGuard } from './guard/loggedUserOnly/logged-users-only.guard';
import { especialistasOnlyGuard } from './guard/especialistasOnly/especialistas-only.guard';
import { guestsOnlyGuard } from './guard/guestsOnly/guests-only.guard';

const routes: Routes = [
  {
    path: 'ingresar',
    component: LoginComponent,
    title: 'MiClinica - Ingreso usuarios',
    canActivate: [guestsOnlyGuard],
  },
  {
    path: 'registro',
    component: RegisterComponent,
    title: 'MiClinica - Registro usuarios',
    canActivate: [guestsOnlyGuard],
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [loggedUsersOnlyGuard],
    title: 'MiClinica - Perfil'
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule),
    canActivate: [isAdminGuard],
    title: 'MiClinica - Usuarios'
  },
  {
    path: 'pacientes',
    loadChildren: () => import('./modules/pacientes/pacientes.module').then(m => m.PacientesModule),
    canActivate: [especialistasOnlyGuard],
    title: 'MiClinica - Pacientes'
  },
  {
    path: 'turnos',
    loadChildren: () => import('./modules/turnos/turnos/turnos.module').then(m => m.TurnosModule),
    canActivate: [loggedUsersOnlyGuard],
    title: 'MiClinica - Mis turnos'
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
