import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import { Observable, Subject, of, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, catchError, tap, switchMap } from 'rxjs/operators';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { Turno } from 'src/app/classes/turno/turno';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import Swal from 'sweetalert2';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.sass'],
  providers: []
})
export class SolicitarTurnoComponent {

  @ViewChild('botonCierreModal') botonCierreModal: any;

  formularioSolicitarTurno: FormGroup;

  public especialistas$: Observable<any[]>;

  public dateSeleccionada: Date;
  public botonDeshabilitado: boolean = false;

  @ViewChild('selectEsp', { static: true }) selectEsp: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  buscando = false;
  busquedaFallida = false;

  mesesDatepicker = 2;
  showWeekNumbers = false;

  dates: Date[];


  turnoEspecialistaSeleccionado: Turno[];

  especialistaSeleccionado: Especialista;

  /* Está abierta al público de lunes a viernes en el horario de 8:00 a 19:00
  y los sábados en el horario de 8:00 a 14:00. La duración mínima de un turno es
  30 minutos. */
  constructor(public usuariosService: UsuarioService, private turnosService: TurnosService, private formBuilder: FormBuilder) {
    this.especialistas$ = this.usuariosService.traerTodos('especialista');
    this.formularioSolicitarTurno = this.formBuilder.group({
      especialidad: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      fechaTurno: new FormControl<Date | null>(null, [Validators.required]),
      detalle: new FormControl('', [Validators.maxLength(255)]),
    }, { validators: this.validarFechaTurno() });

    if (usuariosService.usuarioIngresado?.isAdmin()) {
      this.formularioSolicitarTurno.addControl('paciente', new FormControl<Paciente | null>(null, [Validators.required]))
    }
  }

  validarFechaTurno(): ValidatorFn {
    return (formulario: AbstractControl): ValidationErrors | null => {
      let ctrlCalendarioTurno = formulario.get('fechaTurno');
      let ctrlEspecialista = formulario.get('especialista');
      if (ctrlCalendarioTurno?.value && ctrlEspecialista?.value) {
        let calendario = ctrlCalendarioTurno.value as Date;
        if (!ctrlEspecialista.value?.disponibleEnFecha(calendario)) {
          return {
            noDisponible: true,
          }
        }
      }
      return null;
    };
  }
  formatter = (x: Usuario) => x.nombre;

  buscarPaciente: OperatorFunction<string, readonly Usuario[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.buscando = true)),
      switchMap((term) => this.usuariosService.buscarUsuario(term, 'paciente').pipe(
        tap(() => (this.busquedaFallida = false)),
        catchError(() => {
          this.busquedaFallida = true;
          return of([]);
        }))
      ),
      tap(() => (this.buscando = false)),
    );

  solicitarTurno() {
    if (!this.formularioSolicitarTurno.valid) return;

    this.botonDeshabilitado = true;
    let usuarioIngresado = this.usuariosService.usuarioIngresado;

    let especialidad = this.formularioSolicitarTurno.get('especialidad')?.value;
    let fechaTurno = this.formularioSolicitarTurno.get('fechaTurno')?.value;
    let detalle = this.formularioSolicitarTurno.get('detalle')?.value;
    let paciente: Paciente = <Paciente>usuarioIngresado;

    if (usuarioIngresado?.isAdmin()) {
      paciente = this.formularioSolicitarTurno.get('paciente')?.value;
    }

    let nuevoTurno = new Turno('0', especialidad, fechaTurno, detalle, this.especialistaSeleccionado, paciente);
    this.turnosService.nuevoTurno(nuevoTurno).then((res: any) => {
      this.mostrarModal('Turno agregado con Exito', 'success', `Ahora solo falta que el especialista ${this.especialistaSeleccionado.nombre} confirme la cita!.`);
    }).catch(error => {
      this.mostrarModal('Hubo un problema al subir la cita', 'error', 'Por favor, vuelva a intearlo nuevamente en algunos minutos.');
    }).finally(() => {
      this.botonDeshabilitado = false;
      this.botonCierreModal.nativeElement.click();
    });
  }

  seleccionarEspecialista(especialista: Especialista) {
    this.especialistaSeleccionado = especialista;
    this.dates = this.especialistaSeleccionado.disponibilidadesProximas();
    this.formularioSolicitarTurno.patchValue({
      especialista: especialista,
    });
  }

  seleccionarFecha(date: Date) {
    this.dateSeleccionada = date;

    this.formularioSolicitarTurno.patchValue({
      fechaTurno: date,
    });
  }

  seleccionarEspecialidad(especialidad: String) {
    this.formularioSolicitarTurno.patchValue({
      especialidad: especialidad,
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
      this.formularioSolicitarTurno.reset();
    })
  }
}
