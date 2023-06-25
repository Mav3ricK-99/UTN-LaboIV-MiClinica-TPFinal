import { Component, Input, ViewChild } from '@angular/core';
import { EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { Historial } from 'src/app/classes/historial/historial';
import { HistorialService } from 'src/app/services/historial/historial.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modal-finalizar-turno',
  templateUrl: './modal-finalizar-turno.component.html',
  styleUrls: ['./modal-finalizar-turno.component.sass']
})
export class ModalFinalizarTurnoComponent {

  @ViewChild('botonCierreModal') botonCierreModal: any;

  @Input('turno') turno: Turno;

  formularioFinalizarTurno: FormGroup;

  constructor(private turnosService: TurnosService, private historialService: HistorialService, private formBuilder: FormBuilder) {
    this.formularioFinalizarTurno = this.formBuilder.group({
      descripcion: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      altura: new FormControl('', [Validators.required, Validators.max(250), Validators.min(100)]),
      peso: new FormControl('', [Validators.required, Validators.max(200), Validators.min(10)]),
      temperatura: new FormControl('', [Validators.required, Validators.max(50), Validators.min(30)]),
      presionMaxima: new FormControl('', [Validators.required, Validators.max(25), Validators.min(11)]), //escrito como 120/80 mm Hg
      presionMinima: new FormControl('', [Validators.required, Validators.max(10), Validators.min(6)]),
      datosExtra: this.formBuilder.array([this.crearFormGroupClaveValor()])
    }, { validators: this.verificarDatosExtra });
  }

  private crearFormGroupClaveValor(): FormGroup {
    return new FormGroup({
      'clave': new FormControl(''),
      'valor': new FormControl('')
    })
  }

  verificarDatosExtra: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let datosExtraArray = control.get('datosExtra')?.value;

    if (datosExtraArray.length > 5) {
      return { excedido: true };
    }

    var incompleto = false;
    datosExtraArray.forEach((datos: any) => {
      if ((datos.clave != '' && datos.valor == '') || (datos.clave == '' && datos.valor != '')) {
        incompleto = true;
      }
    });

    return incompleto == false ? null : { incompleto: true };
  };

  agregarDatosExtra() {
    let datosExtraFormArray = this.formularioFinalizarTurno.get('datosExtra') as FormArray;
    datosExtraFormArray.push(this.crearFormGroupClaveValor());
  }

  finalizarTurno() {
    if (!this.formularioFinalizarTurno.valid) return;

    let mensaje = this.formularioFinalizarTurno.get('descripcion')?.value;

    this.turnosService.actualizarEstadoTurno(this.turno, EstadosTurnos.finalizado, mensaje);

    let altura = this.formularioFinalizarTurno.get('altura')?.value;
    let peso = this.formularioFinalizarTurno.get('peso')?.value;
    let temperatura = this.formularioFinalizarTurno.get('temperatura')?.value;
    let presionMaxima = this.formularioFinalizarTurno.get('presionMaxima')?.value;
    let presionMinima = this.formularioFinalizarTurno.get('presionMinima')?.value;

    let presion = `${presionMaxima}/${presionMinima} mm Hg`;

    let datosExtra = this.formularioFinalizarTurno.get('datosExtra')?.value;
    let mapDatosExtra: Map<String, String> = datosExtra.map((datos: any) => {
      return { [datos.clave]: datos.valor };
    });

    let nuevoHistorial = new Historial('0', altura, peso, temperatura, presion);
    nuevoHistorial.turno = this.turno;
    nuevoHistorial.datosExtra = mapDatosExtra;

    this.historialService.nuevoHistorial(nuevoHistorial).then(() => {
      this.mostrarModal('Historial agregado', 'success', 'Vinculado el historial al paciente con exito.');
      this.botonCierreModal.nativeElement.click();
    }).catch(() => {
      this.mostrarModal('Error!', 'error', 'Hubo un problema al guardar el historial del paciente.');
    });
  }

  mostrarModal(titulo: string, icon: string, textoCuerpo: string) {
    if (icon != 'success' && icon != 'error') return;
    Swal.fire({
      title: titulo,
      icon: icon,
      text: textoCuerpo,
      confirmButtonText: 'OK!',
    }).then(() => {
      this.formularioFinalizarTurno.reset();
    })
  }
}
