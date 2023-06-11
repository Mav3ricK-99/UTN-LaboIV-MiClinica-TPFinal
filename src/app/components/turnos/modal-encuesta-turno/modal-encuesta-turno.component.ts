import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { EncuestaTurno, Turno } from 'src/app/classes/turno/turno';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-encuesta-turno',
  templateUrl: './modal-encuesta-turno.component.html',
  styleUrls: ['./modal-encuesta-turno.component.sass']
})
export class ModalEncuestaTurnoComponent implements OnChanges {

  @ViewChild('botonCierreModal') botonCierreModal: any;

  @Input('turno') turno: Turno;

  formularioEncuestaTurno: FormGroup;

  calificacionInstalaciones: string;
  calificacionRecepcion: string;

  constructor(private turnosService: TurnosService, private formBuilder: FormBuilder, ratingConfig: NgbRatingConfig) {
    this.formularioEncuestaTurno = this.formBuilder.group({
      puntajeInstalaciones: new FormControl<number | null>(null, Validators.required),
      descripcionInstalacines: new FormControl('', [Validators.minLength(6), Validators.maxLength(255)]),
      puntajeRecepcion: new FormControl<number | null>(null, Validators.required),
      descripcionRecepcion: new FormControl('', [Validators.minLength(6), Validators.maxLength(255)]),
    });

    ratingConfig.max = 5;
  }

  ngOnChanges(): void {
    if (this.turno && this.turno.existeEncuesta()) {
      const encuesta = this.turno.encuesta;
      this.formularioEncuestaTurno.get('puntajeInstalaciones')?.setValue(encuesta.puntajeInstalaciones);
      this.formularioEncuestaTurno.get('descripcionInstalacines')?.setValue(encuesta.mensajeInstalaciones);
      this.formularioEncuestaTurno.get('puntajeRecepcion')?.setValue(encuesta.puntajeRecepcion);
      this.formularioEncuestaTurno.get('descripcionRecepcion')?.setValue(encuesta.mensajeRecepcion);

      this.formularioEncuestaTurno.disable();
    }
  }

  cambioRate($event: any, calificacion: string) {
    let stringCalificacion = '';
    switch ($event) {
      case 1: { stringCalificacion = 'Terrible' }; break;
      case 2: { stringCalificacion = 'Muy mala' }; break;
      case 3: { stringCalificacion = 'Pudo ser mejor' }; break;
      case 4: { stringCalificacion = 'Muy buena' }; break;
      case 5: { stringCalificacion = 'Excelente' }; break;
    }

    switch (calificacion) {
      case 'instalaciones': this.calificacionInstalaciones = stringCalificacion; break;
      case 'recepcion': this.calificacionRecepcion = stringCalificacion; break;
    }
  }

  cambiarMensajeCalificacion(calificacion: string) {
    let stringCalificacion = '';
    switch (this.formularioEncuestaTurno.get(calificacion)?.value) {
      case 1: { stringCalificacion = 'Terrible' }; break;
      case 2: { stringCalificacion = 'Muy mala' }; break;
      case 3: { stringCalificacion = 'Pudo ser mejor' }; break;
      case 4: { stringCalificacion = 'Muy buena' }; break;
      case 5: { stringCalificacion = 'Excelente' }; break;
    }

    switch (calificacion) {
      case 'puntajeInstalaciones': this.calificacionInstalaciones = stringCalificacion; break;
      case 'puntajeRecepcion': this.calificacionRecepcion = stringCalificacion; break;
    }
  }


  enviarEncuesta() {
    if (!this.formularioEncuestaTurno.valid) return;

    let encuesta: EncuestaTurno = {
      mensajeInstalaciones: this.formularioEncuestaTurno.get('descripcionInstalacines')?.value,
      puntajeInstalaciones: this.formularioEncuestaTurno.get('puntajeInstalaciones')?.value,
      mensajeRecepcion: this.formularioEncuestaTurno.get('descripcionRecepcion')?.value,
      puntajeRecepcion: this.formularioEncuestaTurno.get('puntajeRecepcion')?.value
    }
    this.turnosService.enviarEncuesta(this.turno, encuesta);
    this.botonCierreModal.nativeElement.click();

  }
}
