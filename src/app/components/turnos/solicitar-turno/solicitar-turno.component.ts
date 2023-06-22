import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos/turnos.service';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import { Observable, Subject, merge, of, OperatorFunction, ObservableInput } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, catchError, tap, switchMap } from 'rxjs/operators';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbDatepickerI18n, NgbTimeStruct, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Especialidades, Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { Turno } from 'src/app/classes/turno/turno';
import { DatepickerService } from 'src/app/services/datepicker/datepicker.service';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.sass'],
  providers: [{ provide: NgbDatepickerI18n, useClass: DatepickerService }]
})
export class SolicitarTurnoComponent {

  @ViewChild('botonCierreModal') botonCierreModal: any;

  formularioSolicitarTurno: FormGroup;

  @ViewChild('selectEsp', { static: true }) selectEsp: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  buscando = false;
  busquedaFallida = false;

  mesesDatepicker = 2;
  showWeekNumbers = false;
  fechaHoyNgb: NgbDate;
  fechaMaxNgb: NgbDate;

  minutosTurno: number = 30; //30 minutos minimo el turno

  turnoEspecialistaSeleccionado: Turno[];

  /* Está abierta al público de lunes a viernes en el horario de 8:00 a 19:00
  y los sábados en el horario de 8:00 a 14:00. La duración mínima de un turno es
  30 minutos. */
  constructor(calendario: NgbCalendar, public usuariosService: UsuarioService, private turnosService: TurnosService, private formBuilder: FormBuilder) {
    this.fechaHoyNgb = calendario.getToday();
    this.fechaMaxNgb = calendario.getNext(this.fechaHoyNgb, 'd', 15);

    this.formularioSolicitarTurno = this.formBuilder.group({
      especialidad: new FormControl<Especialidades | null>(null, [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      especialista: new FormControl<Especialista | null>(null, [Validators.required]),
      fechaTurno: new FormControl<NgbDateStruct | null>(null, [Validators.required]),
      horarioTurno: new FormControl<NgbTimeStruct | null>(null, [Validators.required, this.validarHorarioTurno]),
      detalle: new FormControl('', [Validators.maxLength(255)]),
    }, { validators: this.validarFechaTurno() });
    this.formularioSolicitarTurno.get('especialista')?.valueChanges.subscribe(especialista => this.cambioEspecialista(especialista))

    if (usuariosService.usuarioIngresado?.isAdmin()) {
      this.formularioSolicitarTurno.addControl('paciente', new FormControl<Paciente | null>(null, [Validators.required]))
    }
  }

  cambioEspecialista(especialista: Especialista) {
    if (!especialista) return; //Si no es un especialista valido

    let ctrlEspecialidad = this.formularioSolicitarTurno.get('especialidad');
    ctrlEspecialidad?.setValue(especialista.especialidad);

    var ctrlCalendarioTurno = this.formularioSolicitarTurno.get('fechaTurno');
    var ctrlHorarioTurno = this.formularioSolicitarTurno.get('horarioTurno');

    ctrlCalendarioTurno?.disable();
    ctrlHorarioTurno?.disable();

    this.turnosService.traerTurnosUsuario(especialista).forEach((turnos: Turno[]) => {
      turnos.forEach((turno) => {
        especialista.agregarTurno(turno); //Guardo los turnos del especialista!
      })
    });

    setTimeout(() => {
      ctrlCalendarioTurno?.enable();
      ctrlHorarioTurno?.enable();
      let fechaProxima = especialista.disponibilidadProxima();
      if (fechaProxima != undefined) {

        let fechaTurno = {
          year: fechaProxima.getFullYear(),
          month: fechaProxima.getMonth() + 1,
          day: fechaProxima.getDate(),
        }

        let horarioTurno = {
          hour: fechaProxima.getHours(),
          minute: fechaProxima.getMinutes(),
          second: 0,
        }

        ctrlCalendarioTurno?.setValue(fechaTurno);
        ctrlHorarioTurno?.setValue(horarioTurno);
      }
    }, 1000);
  }

  validarFechaTurno(): ValidatorFn {
    return (formulario: AbstractControl): ValidationErrors | null => {
      let ctrlCalendarioTurno = formulario.get('fechaTurno');
      let ctrlHorarioTurno = formulario.get('horarioTurno');
      let ctrlEspecialista = formulario.get('especialista');
      if (ctrlCalendarioTurno?.value && ctrlHorarioTurno?.value && ctrlEspecialista?.value) {
        let calendario = ctrlCalendarioTurno.value;
        let horario = ctrlHorarioTurno.value;
        let fechaSolicitada = new Date(
          calendario.year,
          (calendario.month - 1),
          calendario.day, horario.hour,
          horario.minute, 0
        );
        if (!ctrlEspecialista.value?.disponibleEnFecha(fechaSolicitada)) {
          return {
            noDisponible: true,
          }
        }
      }
      return null;
    };
  }

  private validarHorarioTurno(control: AbstractControl): null | object {
    let horarioTurno = control?.value;
    if (!horarioTurno) {
      return null;
    }

    if (horarioTurno.hour < 8) {
      return { tooEarly: true };
    }
    if (horarioTurno.hour > 14) {
      return { tooLate: true };
    }

    return null;
  }

  buscarEspecialidad: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.selectEsp.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? Object.values(Especialidades) : Object.values(Especialidades).filter((v: string) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
      ),
    );
  };
  formatter = (x: Usuario) => x.nombre;

  buscarEspecialista: OperatorFunction<string, readonly Usuario[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.buscando = true)),
      switchMap((term) => {
        let resultado: ObservableInput<any>;
        let especialidad = this.formularioSolicitarTurno.get('especialidad')?.value;
        if (especialidad) {
          resultado = this.usuariosService.buscarEspecialistaPorEspecialidad(especialidad, term);
        } else {
          resultado = this.usuariosService.buscarUsuario(term, 'especialista');
        }

        return resultado.pipe(
          tap(() => (this.busquedaFallida = false)),
          catchError(() => {
            this.busquedaFallida = true;
            return of([]);
          }));
      }
      ),
      tap(() => (this.buscando = false)),
    );

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

    let usuarioIngresado = this.usuariosService.usuarioIngresado;

    let especialidad = this.formularioSolicitarTurno.get('especialidad')?.value;
    let especialista = this.formularioSolicitarTurno.get('especialista')?.value;
    let fechaTurno = this.formularioSolicitarTurno.get('fechaTurno')?.value;
    let horarioTurno = this.formularioSolicitarTurno.get('horarioTurno')?.value;
    let detalle = this.formularioSolicitarTurno.get('detalle')?.value;
    let paciente: Paciente = <Paciente>usuarioIngresado;

    if (usuarioIngresado?.isAdmin()) {
      paciente = this.formularioSolicitarTurno.get('paciente')?.value;
    }

    let fechaSolicitada = new Date(
      fechaTurno.year,
      (fechaTurno.month - 1),
      fechaTurno.day, horarioTurno.hour,
      horarioTurno.minute, 0
    );

    let nuevoTurno = new Turno('0', especialidad, fechaSolicitada, detalle, especialista, paciente);

    this.turnosService.nuevoTurno(nuevoTurno).then((res: any) => {
      this.mostrarModal('Turno agregado con Exito', 'success', `Ahora solo falta que el especialista ${especialista.nombre} confirme la cita!.`);
      this.botonCierreModal.nativeElement.click();
    }).catch(error => {
      this.mostrarModal('Hubo un problema al subir la cita', 'error', 'Por favor, vuelva a intearlo nuevamente en algunos minutos.');
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
