import { Component, Input, ViewChild } from '@angular/core';
import { EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
@Component({
  selector: 'app-modal-finalizar-turno',
  templateUrl: './modal-finalizar-turno.component.html',
  styleUrls: ['./modal-finalizar-turno.component.sass']
})
export class ModalFinalizarTurnoComponent {

  @ViewChild('botonCierreModal') botonCierreModal: any;

  @Input('turno') turno: Turno;

  formularioFinalizarTurno: FormGroup;

  constructor(private turnosService: TurnosService, private formBuilder: FormBuilder) {
    this.formularioFinalizarTurno = this.formBuilder.group({
      descripcion: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    });
  }

  finalizarTurno() {
    if (!this.formularioFinalizarTurno.valid) return;

    let mensaje = this.formularioFinalizarTurno.get('descripcion')?.value;
    this.turnosService.actualizarEstadoTurno(this.turno, EstadosTurnos.finalizado, mensaje);
    this.botonCierreModal.nativeElement.click();
  }
}
