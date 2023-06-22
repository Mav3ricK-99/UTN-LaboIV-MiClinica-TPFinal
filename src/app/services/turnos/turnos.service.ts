import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, and, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { UsuarioService } from '../usuarios/usuarios.service';
import { map } from 'rxjs';
import { CalificacionTurno, EncuestaTurno, EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { FiltroTurnos } from 'src/app/components/turnos/filtros-turnos/filtros-turnos.component';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  turnosCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private usuariosService: UsuarioService) {
    this.turnosCollection = collection(this.firestore, 'turnos');
  }

  nuevoTurno(turno: Turno) {
    return addDoc(this.turnosCollection, {
      especialidad: turno.especialidad,
      especialista_uid: turno.especialista.uid,
      paciente_uid: turno.paciente.uid,
      fecha_turno: turno.fecha_turno,
      detalle: turno.detalle,
      estado: turno.estado
    });
  }

  traerTodos(filtros?: FiltroTurnos) {
    let q = query(this.turnosCollection);
    if (filtros) {
      q = query(this.turnosCollection, this.filtrar(filtros));
    }

    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => this.armarTurno(b, true));
    }));;
  }

  traerMisTurnos(filtros?: FiltroTurnos) {
    var usuarioIngresado = this.usuariosService.usuarioIngresado;
    let campo = usuarioIngresado instanceof Paciente ? 'paciente_uid' : 'especialista_uid';

    let q = query(this.turnosCollection, where(campo, "==", usuarioIngresado?.uid));
    if (filtros) {
      q = query(this.turnosCollection, and(where(campo, "==", usuarioIngresado?.uid), this.filtrar(filtros)));
    }

    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => {
        let turno: Turno = this.armarTurno(b)
        if (usuarioIngresado instanceof Especialista) {
          this.usuariosService.traerUsuario(b['paciente_uid']).then((doc) => {
            if (doc.exists()) {
              let paciente = this.usuariosService.armarPaciente(doc.data());
              turno.paciente = paciente;
            }
          })
        }

        return turno;
      });
    }));
  }

  actualizarEstadoTurno(turno: Turno, estado: EstadosTurnos, mensaje?: string) {
    const documento = doc(this.firestore, `turnos`, turno.uid);
    return updateDoc(documento, {
      estado: estado,
      mensaje: mensaje ?? ''
    });
  }

  calificarTurno(turno: Turno, calificacionTurno: CalificacionTurno) {
    const documento = doc(this.firestore, `turnos`, turno.uid);
    return updateDoc(documento, {
      calificacion: calificacionTurno
    });
  }

  enviarEncuesta(turno: Turno, encuesta: EncuestaTurno) {
    const documento = doc(this.firestore, `turnos`, turno.uid);
    return updateDoc(documento, {
      encuesta: encuesta
    });
  }

  traerTurnosUsuario(usuario: Usuario) {

    let tipoUsuario: string = '';
    if (usuario instanceof Especialista) {
      tipoUsuario = 'especialista_uid';
    } else if (usuario instanceof Paciente) {
      tipoUsuario = 'paciente_uid';
    };

    const q = query(this.turnosCollection, where(tipoUsuario, "==", usuario.uid));

    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => {
        let turno: Turno = this.armarTurno(b);
        if (usuario instanceof Especialista) {
          turno.especialista = usuario;
        } else if (usuario instanceof Paciente) {
          turno.paciente = usuario;
        };

        return turno;
      });
    }));
  }

  armarTurno(data: any, traerPaciente?: boolean): Turno {
    {
      let turno = new Turno(data['uid'], data['especialidad'], data['fecha_turno'], data['detalle']);
      turno.estado = data['estado'];

      if (data['calificacion']) {
        turno.calificacion = data['calificacion'];
      }

      if (data['encuesta']) {
        turno.encuesta = data['encuesta'];
      }

      if (data['mensaje']) {
        turno.mensaje = data['mensaje'];
      }

      if (this.usuariosService.usuarioIngresado instanceof Paciente) {
        turno.paciente = this.usuariosService.usuarioIngresado;
      }

      if (traerPaciente) {
        this.usuariosService.traerUsuario(data['paciente_uid']).then((d) => {
          let paciente;
          if (d.exists()) {
            paciente = this.usuariosService.armarPaciente(d.data());
            turno.paciente = paciente;
          }
        })
      }

      this.usuariosService.traerUsuario(data['especialista_uid']).then((d) => {
        let especialista;
        if (d.exists()) {
          especialista = this.usuariosService.armarEspecialista(d.data());
          turno.especialista = especialista;
        }
      })

      return turno;
    }
  }

  filtrar(filtros: FiltroTurnos) {
    let qAnd: any = where('especialidad', '==', filtros.especialidad);

    if (filtros.especialidad != undefined) { //gracias firebaseangularjsyasclñacn
      if (filtros.paciente) { //Filtro por paciente
        qAnd = and(
          where('especialidad', '==', filtros.especialidad),
          where('paciente_uid', '==', filtros.paciente.uid));
      } else if (filtros.especialista) { //Filtro por especialista
        qAnd = and(
          where('especialidad', '==', filtros.especialidad),
          where('especialista_uid', '==', filtros.especialista.uid));
      } else {
        qAnd = where('especialidad', '==', filtros.especialidad);
      }
    } else {
      if (filtros.paciente) { //Filtro por paciente
        qAnd = where('paciente_uid', '==', filtros.paciente.uid);
      } else if (filtros.especialista) { //Filtro por especialista
        qAnd = where('especialista_uid', '==', filtros.especialista.uid);
      }
    }

    return qAnd;
  }
}
