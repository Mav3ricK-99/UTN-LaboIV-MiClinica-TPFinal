import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
      altura: new FormControl(null, [Validators.max(250), Validators.min(100)]),
      peso: new FormControl(null, [Validators.max(200), Validators.min(10)]),
      temperatura: new FormControl(null, [Validators.max(50), Validators.min(30)]),
      presionMaxima: new FormControl(null, [Validators.max(25), Validators.min(11)]), //escrito como 120/80 mm Hg
      presionMinima: new FormControl(null, [Validators.max(10), Validators.min(6)]),
    }, { validators: this.validarFiltroPresion() });

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

  validarFiltroPresion(): ValidatorFn {
    return (formulario: AbstractControl): ValidationErrors | null => {
      let ctrlPresionMaxima = formulario.get('presionMaxima');
      let ctrlPresionMinima = formulario.get('presionMinima');
      if ((ctrlPresionMaxima?.value && !ctrlPresionMinima?.value) || (!ctrlPresionMaxima?.value && ctrlPresionMinima?.value)) {
        return {
          losDosCamposSonRequeridos: true,
        }
      }
      return null;
    };
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

  actualizarFiltros(data: any) { //perdon
    if (!this.formularioFiltros.valid ||
      (data['especialidad'] == null &&
        data['paciente'] == null &&
        data['especialista'] == null &&
        data['peso'] == null &&
        data['temperatura'] == null &&
        data['presionMaxima'] == null &&
        data['altura'] == null)) return;


    let filtros: FiltroTurnos = {};

    for (const [key, value] of Object.entries(data)) {
      switch (key) {
        case 'paciente': filtros[key] = value as Paciente; break;
        case 'especialista': filtros[key] = value as Especialista; break;
        case 'especialidad': filtros[key] = value as string; break;
        case 'altura': filtros[key] = value as number; break;
        case 'peso': filtros[key] = value as number; break;
        case 'temperatura': filtros[key] = value as number; break;
        case 'presionMaxima': filtros['presion'] = value as string; break;
      }
    }

    this.filtro.emit(filtros);
  }
}

export interface FiltroTurnos {
  especialidad?: string,
  paciente?: Paciente,
  especialista?: Especialista,
  altura?: number,
  peso?: number,
  temperatura?: number,
  presion?: string,
}
