import { Component, Input, ViewChild } from '@angular/core';
import { CalificacionTurno, Turno } from 'src/app/classes/turno/turno';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-calificar-atencion',
  templateUrl: './modal-calificar-atencion.component.html',
  styleUrls: ['./modal-calificar-atencion.component.sass']
})
export class ModalCalificarAtencionComponent {

  @ViewChild('botonCierreModal') botonCierreModal: any;

  @Input('turno') turno: Turno;

  formularioCalificarTurno: FormGroup;

  calificacion: string;

  constructor(private turnosService: TurnosService, private formBuilder: FormBuilder, ratingConfig: NgbRatingConfig) {
    this.formularioCalificarTurno = this.formBuilder.group({
      descripcion: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      puntaje: new FormControl<number | null>(null, Validators.required),
    });

    ratingConfig.max = 5;

  }

  cambioRate($event: any) {
    switch ($event) {
      case 1: { this.calificacion = 'Terrible' }; break;
      case 2: { this.calificacion = 'Muy mala' }; break;
      case 3: { this.calificacion = 'Pudo ser mejor' }; break;
      case 4: { this.calificacion = 'Muy buena' }; break;
      case 5: { this.calificacion = 'Excelente' }; break;
    }
  }

  cambiarMensajeCalificacion() {
    switch (this.formularioCalificarTurno.get('puntaje')?.value) {
      case 1: { this.calificacion = 'Terrible' }; break;
      case 2: { this.calificacion = 'Muy mala' }; break;
      case 3: { this.calificacion = 'Pudo ser mejor' }; break;
      case 4: { this.calificacion = 'Muy buena' }; break;
      case 5: { this.calificacion = 'Excelente' }; break;
    }
  }

  calificarTurno() {
    if (!this.formularioCalificarTurno.valid) return;

    let calificacionTurno: CalificacionTurno = {
      mensaje: this.formularioCalificarTurno.get('descripcion')?.value,
      puntaje: this.formularioCalificarTurno.get('puntaje')?.value
    }

    this.turnosService.calificarTurno(this.turno, calificacionTurno);
    this.botonCierreModal.nativeElement.click();
  }
}
