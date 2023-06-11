import { Component, Input, ViewChild } from '@angular/core';
import { EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos/turnos.service';

@Component({
  selector: 'app-modal-cancelar-turno',
  templateUrl: './modal-cancelar-turno.component.html',
  styleUrls: ['./modal-cancelar-turno.component.sass']
})
export class ModalCancelarTurnoComponent {

  @ViewChild('botonCierreModalCancelarTurno') botonCierreModalCancelarTurno: any;

  @Input('turno') turno: Turno;

  formularioCancelarTurno: FormGroup;

  @Input('soyPaciente') soyPaciente: boolean

  constructor(private turnosService: TurnosService, private formBuilder: FormBuilder) {
    this.formularioCancelarTurno = this.formBuilder.group({
      descripcion: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    });
  }

  cancelarTurno() {
    if (!this.formularioCancelarTurno.valid) return;

    let mensaje = this.formularioCancelarTurno.get('descripcion')?.value;
    this.turnosService.actualizarEstadoTurno(this.turno, EstadosTurnos.cancelado, mensaje);
    this.botonCierreModalCancelarTurno.nativeElement.click();
  }
}
