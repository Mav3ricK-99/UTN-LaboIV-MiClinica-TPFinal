import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import { Observable, Subject, merge, of, OperatorFunction, ObservableInput } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, catchError, tap, switchMap } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Especialidades, Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';

@Component({
  selector: 'app-filtros-turnos',
  templateUrl: './filtros-turnos.component.html',
  styleUrls: ['./filtros-turnos.component.sass']
})
export class FiltrosTurnosComponent implements OnInit {

  @Input('filtrarPor') filtrarPor: string;
  @Output() filtro = new EventEmitter<FiltroTurnos>();

  @ViewChild('selectEsp', { static: true }) selectEsp: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  buscando = false;
  busquedaFallida = false;

  formularioFiltros: FormGroup;

  constructor(formBuilder: FormBuilder, public usuariosService: UsuarioService) {
    this.formularioFiltros = formBuilder.group({
      especialidad: new FormControl<Especialidades | null>(null, [Validators.minLength(6), Validators.maxLength(255)]),
    });

    this.formularioFiltros.valueChanges.pipe(
      debounceTime(200), distinctUntilChanged(),
    ).subscribe((data) => this.actualizarFiltros(data));
  }

  ngOnInit(): void {
    if (this.filtrarPor == 'paciente') {
      this.formularioFiltros.addControl('paciente', new FormControl<Paciente | null>(null))
    } else {
      this.formularioFiltros.addControl('especialista', new FormControl<Especialista | null>(null))
    }
  }

  buscarEspecialista: OperatorFunction<string, readonly Usuario[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.buscando = true)),
      switchMap((term) => {
        let resultado: ObservableInput<any>;
        let especialidad = this.formularioFiltros.get('especialidad')?.value;
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

  actualizarFiltros(data: any) {
    if (!this.formularioFiltros.valid ||
      (data['especialidad'] == null &&
        data['paciente'] == null &&
        data['especialista'] == null)) return;


    let filtros: FiltroTurnos = {
      especialidad: data['especialidad'],
    };

    if (this.filtrarPor == 'paciente') {
      filtros.paciente = data['paciente'];
    } else {
      filtros.especialista = data['especialista'];
    }


    this.filtro.emit(filtros);
  }
}

export interface FiltroTurnos {
  especialidad: Especialidades,
  paciente?: Paciente,
  especialista?: Especialista,
}
