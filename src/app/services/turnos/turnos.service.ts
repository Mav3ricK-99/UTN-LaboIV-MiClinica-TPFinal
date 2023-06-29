import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, QueryFilterConstraint, addDoc, and, collection, collectionData, doc, getDoc, query, updateDoc, where } from '@angular/fire/firestore';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { UsuarioService } from '../usuarios/usuarios.service';
import { filter, map } from 'rxjs';
import { CalificacionTurno, EncuestaTurno, EstadosTurnos, Turno } from 'src/app/classes/turno/turno';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { FiltroTurnos } from 'src/app/components/turnos/filtros-turnos/filtros-turnos.component';
import { Historial } from 'src/app/classes/historial/historial';

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

  traerTurno(uid: string) {
    return getDoc(doc(this.firestore, `turnos/${uid}`)).then((b) => {
      return this.armarTurno(b.data(), true);
    });
  }

  traerTodos(filtros?: FiltroTurnos) {
    let q = query(this.turnosCollection);
    if (filtros?.especialidad || filtros?.paciente || filtros?.especialista) {
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
    if (filtros?.especialidad || filtros?.paciente || filtros?.especialista) {
      q = query(this.turnosCollection, and(where(campo, "==", usuarioIngresado?.uid), this.filtrar(filtros)));
    }

    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => {
        let turno: Turno = this.armarTurno(b)
        if (usuarioIngresado instanceof Especialista) {
          this.usuariosService.traerUsuario(b['paciente_uid']).then((doc) => {
            if (doc.exists()) {
              let paciente = this.usuariosService.armarPaciente(doc.data());
              paciente.uid = doc.id;
              turno.paciente = paciente;
            }
          })
        }

        return turno;
      });
    }), map((turnos: Turno[]) => {
      return turnos.filter((turno: Turno, i: number) => {
        let pasoElFiltro = true;
        if (filtros) {

          if (filtros.altura && filtros.altura != turno.historial.altura) {
            pasoElFiltro = false;
          }

          if (filtros.peso && filtros.peso != turno.historial.peso) {
            pasoElFiltro = false;
          }

          if (filtros.temperatura && filtros.temperatura != turno.historial.temperatura) {
            pasoElFiltro = false;
          }

          if (filtros.presion && filtros.presion != turno.historial.presion) {
            pasoElFiltro = false;
          }
        }

        return pasoElFiltro ? turno : undefined;
      })
    }));
  }

  traerIdsMisPacientes() {
    var usuarioIngresado = this.usuariosService.usuarioIngresado;

    let q = query(this.turnosCollection, where('especialista_uid', '==', usuarioIngresado?.uid));
    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => {
        return b['paciente_uid'];
      }).reduce(function (acc, curr) {
        if (!acc.includes(curr))
          acc.push(curr);
        return acc;
      }, []);
    }));
  }

  actualizarEstadoTurno(turno: Turno, estado: EstadosTurnos, mensaje?: string, historial?: Historial) {
    const documento = doc(this.firestore, `turnos`, turno.uid);
    let obj: any = { estado: estado };
    if (mensaje) {
      obj.mensaje = mensaje;
    }
    if (historial) {
      obj.historial = {
        altura: historial.altura,
        peso: historial.peso,
        temperatura: historial.temperatura,
        presion: historial.presion,
        datosExtra: historial.datosExtra
      };
    }
    return updateDoc(documento, obj);
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

  traerTurnosUsuario(usuario: Usuario, estadoTurno?: EstadosTurnos, especialidad?: string) {

    let tipoUsuario: string = '';
    if (usuario instanceof Especialista) {
      tipoUsuario = 'especialista_uid';
    } else if (usuario instanceof Paciente) {
      tipoUsuario = 'paciente_uid';
    };

    let q = query(this.turnosCollection, where(tipoUsuario, "==", usuario.uid));

    if (estadoTurno) {
      q = query(this.turnosCollection, where(tipoUsuario, "==", usuario.uid), where('estado', "==", estadoTurno));
    }

    if (estadoTurno && especialidad) {
      q = query(this.turnosCollection, where(tipoUsuario, "==", usuario.uid), where('estado', "==", estadoTurno), where('especialidad', "==", especialidad));
    }

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

      if (data['historial']) {
        turno.historial = data['historial'];
      }

      if (this.usuariosService.usuarioIngresado instanceof Paciente) {
        turno.paciente = this.usuariosService.usuarioIngresado;
      }

      if (traerPaciente) {
        this.usuariosService.traerUsuario(data['paciente_uid']).then((d) => {
          let paciente;
          if (d.exists()) {
            paciente = this.usuariosService.armarPaciente(d.data());
            paciente.uid = d.id;
            turno.paciente = paciente;
          }
        })
      }

      this.usuariosService.traerUsuario(data['especialista_uid']).then((d) => {
        let especialista;
        if (d.exists()) {
          especialista = this.usuariosService.armarEspecialista(d.data());
          especialista.uid = d.id;
          turno.especialista = especialista;
        }
      })

      return turno;
    }
  }

  filtrar(filtros: FiltroTurnos) { //No puedo pasarle un array de 'wheres' a 'and'..
    let qAnd: any = where('especialidad', '==', filtros.especialidad);

    if (filtros.especialidad != undefined && filtros.especialidad != "") { //gracias firebaseangularjsyasclñacn
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
      if (filtros.paciente != undefined) { //Filtro por paciente
        qAnd = where('paciente_uid', '==', filtros.paciente.uid);
      } else if (filtros.especialista != undefined) { //Filtro por especialista
        qAnd = where('especialista_uid', '==', filtros.especialista.uid);
      }
    }

    return qAnd;
  }
}
