import { Component, ViewChild } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { Workbook } from 'exceljs';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { UsuarioService } from 'src/app/services/usuarios/usuarios.service';
import * as fs from 'file-saver';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';
@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.sass'],
})
export class ListadoUsuariosComponent {

  mostrarFormulario: string;
  usuarios$: Observable<any[]>;

  @ViewChild('collapse') collapseableElement: NgbCollapse;

  public isCollapsed = true;

  public usuarioSeleccionado: Usuario;

  constructor(private usuariosService: UsuarioService) {
    this.usuarios$ = this.usuariosService.traerTodos();
  }

  cambiarFormulario(formulario: string) {
    this.mostrarFormulario = formulario;
  }

  mostrarHistorialUsuario($event: any) {
    let hacerToggle = false;
    if ($event == this.usuarioSeleccionado || this.usuarioSeleccionado == undefined) {
      hacerToggle = true;
    }
    this.usuarioSeleccionado = $event;
    if (hacerToggle) {
      this.collapseableElement.toggle();
    }
  }

  descargarListadoUsuarios() {
    var workbook = new Workbook();
    var worksheet = workbook.addWorksheet('Usuarios');
    worksheet.columns = [
      { header: 'Numero Usuario', key: 'id', width: 30 },
      { header: 'Nombre', key: 'nombre', width: 35 },
      { header: 'Edad', key: 'edad', width: 25 },
      { header: 'E-Mail', key: 'email', width: 25 },
      { header: 'Obra Social/Especialidad', key: 'obrasocial', width: 23, },
      { header: 'N°Afiliado/N°Matricula', key: 'afiliado', width: 23, },
      { header: 'Tipo de usuario', key: 'tipoUsuario', width: 20, },
    ];

    var rows: any[] = [];
    const promesa = new Promise((resolve) => this.usuarios$.forEach(usuarios => {
      usuarios.forEach((usuario: Usuario, i) => {
        if (usuario instanceof Paciente) {
          worksheet.addRow({ id: usuario.uid, nombre: usuario.nombre, edad: usuario.edad, email: usuario.email, obrasocial: usuario.obraSocial, afiliado: usuario.nroAfiliado, tipoUsuario: usuario.tipoUsuario })
        } else if (usuario instanceof Especialista) {
          worksheet.addRow({ id: usuario.uid, nombre: usuario.nombre, edad: usuario.edad, email: usuario.email, obrasocial: usuario.especialidad, afiliado: usuario.nroMatricula, tipoUsuario: usuario.tipoUsuario })
        } else {
          worksheet.addRow({ id: usuario.uid, nombre: usuario.nombre, edad: usuario.edad, email: usuario.email, obrasocial: '', afiliado: '', tipoUsuario: usuario.tipoUsuario })
        }

      })
      resolve(rows);
    }
    ));

    promesa.then((rows: any) => {
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let fechaHoy = new Date();
        fs.saveAs(blob, `Usuarios-${fechaHoy.toLocaleDateString()}.xlsx`);
      })
    })

  }
}
