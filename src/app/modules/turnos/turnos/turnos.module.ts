import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnosRoutingModule } from './turnos-routing.module';
import { ListadoTurnosComponent } from 'src/app/components/turnos/listado-turnos/listado-turnos.component';
import { TablaTurnosAdministradorComponent } from 'src/app/components/turnos/tabla-turnos-administrador/tabla-turnos-administrador.component';
import { TablaTurnosEspecialistaComponent } from 'src/app/components/turnos/tabla-turnos-especialista/tabla-turnos-especialista.component';
import { TablaTurnosPacienteComponent } from 'src/app/components/turnos/tabla-turnos-paciente/tabla-turnos-paciente.component';
import { FormSharedModule } from '../../shared/form-shared/form-shared.module';
import { ModalCancelarTurnoComponent } from 'src/app/components/turnos/modal-cancelar-turno/modal-cancelar-turno.component';
import { ModalCalificarAtencionComponent } from 'src/app/components/turnos/modal-calificar-atencion/modal-calificar-atencion.component';
import { NgbDatepickerModule, NgbRatingModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalEncuestaTurnoComponent } from 'src/app/components/turnos/modal-encuesta-turno/modal-encuesta-turno.component';
import { ModalRechazarTurnoComponent } from 'src/app/components/turnos/modal-rechazar-turno/modal-rechazar-turno.component';
import { ModalFinalizarTurnoComponent } from 'src/app/components/turnos/modal-finalizar-turno/modal-finalizar-turno.component';
import { SolicitarTurnoComponent } from 'src/app/components/turnos/solicitar-turno/solicitar-turno.component';
import { FiltrosTurnosComponent } from 'src/app/components/turnos/filtros-turnos/filtros-turnos.component';


@NgModule({
  declarations: [
    ListadoTurnosComponent,
    TablaTurnosAdministradorComponent,
    TablaTurnosEspecialistaComponent,
    TablaTurnosPacienteComponent,
    ModalCancelarTurnoComponent,
    ModalCalificarAtencionComponent,
    ModalEncuestaTurnoComponent,
    ModalRechazarTurnoComponent,
    ModalFinalizarTurnoComponent,
    SolicitarTurnoComponent,
    FiltrosTurnosComponent
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    FormSharedModule,
    NgbRatingModule,
    NgbTypeaheadModule,
    NgbTimepickerModule,
    NgbDatepickerModule 
  ]
})
export class TurnosModule { }
