import { Component, Input, ViewChild } from '@angular/core';
import { EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
@Component({
  selector: 'app-modal-rechazar-turno',
  templateUrl: './modal-rechazar-turno.component.html',
  styleUrls: ['./modal-rechazar-turno.component.sass']
})
export class ModalRechazarTurnoComponent {

  @ViewChild('botonCierreModal') botonCierreModal: any;

  @Input('turno') turno: Turno;

  formularioRechazarTurno: FormGroup;

  constructor(private turnosService: TurnosService, private formBuilder: FormBuilder) {
    this.formularioRechazarTurno = this.formBuilder.group({
      descripcion: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    });
  }

  rechazarTurno() {
    if (!this.formularioRechazarTurno.valid) return;

    let mensaje = this.formularioRechazarTurno.get('descripcion')?.value;
    this.turnosService.actualizarEstadoTurno(this.turno, EstadosTurnos.rechazado, mensaje);
    this.botonCierreModal.nativeElement.click();
  }
}
