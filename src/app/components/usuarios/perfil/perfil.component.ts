import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import jsPDF from 'jspdf';
import { Observable, merge, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import html2canvas from 'html2canvas';
import { Especialidades } from 'src/app/classes/usuarios/especialista/especialista';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.sass'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('closed', style({
        opacity: 0.03,
        transform: 'translateY(+300px)'
      })),
      transition('open => closed', [
        animate('.55s ease-out')
      ]),
      transition('closed => open', [
        animate('.55s ease-out')
      ]),
    ])],
})
export class PerfilComponent implements OnInit {
  public usuario: Usuario;
  public isOpen: boolean = false;

  @ViewChild('selectEsp', { static: true }) selectEsp: NgbTypeahead;

  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  buscando = false;
  busquedaFallida = false;

  formularioFiltros: FormGroup;

  especialidadTurno: string;

  constructor(formBuilder: FormBuilder, private usuariosService: UsuarioService) {
    if (usuariosService.usuarioIngresado) {
      this.usuario = usuariosService.usuarioIngresado;
    }

    this.formularioFiltros = formBuilder.group({
      especialidad: new FormControl<Especialidades | null>(null, [Validators.minLength(6), Validators.maxLength(255)]),
    });

    this.formularioFiltros.valueChanges.pipe(
      debounceTime(200), distinctUntilChanged(),
    ).subscribe((data) => this.actualizarFiltros(data));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isOpen = !this.isOpen;
    }, 200);
  }

  public descargarPDF(): void {

    var PDF = new jsPDF('p', 'mm', 'a4');
    let DATA: any = document.getElementById('historiales');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      var img = new Image()
      img.src = 'assets/miClinica.png'
      PDF.addImage(img, 'PNG', 10, 5, 64, 64);
      PDF.addImage(FILEURI, 'PNG', 0, 74, fileWidth, fileHeight);
      let fechaHoy = new Date()
      PDF.save(`historial-paciente-${fechaHoy.toLocaleDateString()}-.pdf`);
    });
  }

  buscarEspecialidad: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : Object.values(Especialidades).filter((v: string) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );

  actualizarFiltros(data: any) {
    if (data['especialidad']) {
      this.especialidadTurno = data['especialidad'];
    }
  }

  deshabilitarCuenta() {
    this.mostrarModal("Esta seguro de deshabilitar su cuenta?", 'info', "Para deshacer esta operacion tendra que contactarse con nuestros operadores.")
  }

  mostrarModal(titulo: string, icon: string, textoCuerpo: string) {
    if (icon != 'success' && icon != 'error' && icon != 'info') return;
    Swal.fire({
      title: titulo,
      icon: icon,
      text: textoCuerpo,
      showCancelButton: true,
      confirmButtonText: 'Deshabilitar',
      cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.isConfirmed && this.usuariosService.usuarioIngresado) {
        this.usuariosService.habilitarCuenta(this.usuariosService.usuarioIngresado.uid, false);
        this.usuariosService.cerrarSesionUsuario();

      }
    })
  }
}
