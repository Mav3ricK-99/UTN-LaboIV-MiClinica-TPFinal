import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { UsuarioService } from '../usuarios/usuarios.service';
import { map } from 'rxjs';
import { CalificacionTurno, EncuestaTurno, EstadosTurnos, Turno } from 'src/app/classes/turno/turno';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  turnosCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private usuariosService: UsuarioService) {
    this.turnosCollection = collection(this.firestore, 'turnos');
  }

  traerTodos() {
    return collectionData(this.turnosCollection, { idField: 'uid' });
  }

  traerMisTurnos() {
    const usuarioIngresado = this.usuariosService.usuarioIngresado;
    let campo = usuarioIngresado instanceof Paciente ? 'paciente_uid' : 'especialista_uid';

    const q = query(this.turnosCollection, where(campo, "==", usuarioIngresado?.uid));


    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => {
        let turno = new Turno(b['uid'], b['especialidad'], b['fecha_turno']);
        turno.estado = b['estado'];

        if (b['calificacion']) {
          turno.calificacion = b['calificacion'];
        }

        if (b['encuesta']) {
          turno.encuesta = b['encuesta'];
        }

        if (b['mensaje']) {
          turno.mensaje = b['mensaje'];
        }

        if (this.usuariosService.usuarioIngresado instanceof Paciente) {
          turno.paciente = this.usuariosService.usuarioIngresado;
        }

        this.usuariosService.traerUsuario(b['especialista_uid']).then((d) => {
          let especialista;
          if (d.exists()) {
            especialista = this.usuariosService.armarEspecialista(d.data());
            turno.especialista = especialista;
          }
        })

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

}
