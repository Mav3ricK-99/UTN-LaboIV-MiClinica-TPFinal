import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, and, collection, collectionData, doc, getDoc, query, updateDoc, where } from '@angular/fire/firestore';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { UsuarioService } from '../usuarios/usuarios.service';
import { map } from 'rxjs';
import { Historial } from 'src/app/classes/historial/historial';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { TurnosService } from '../turnos/turnos.service';
import { Turno } from 'src/app/classes/turno/turno';
import { Usuario } from 'src/app/classes/usuarios/usuario';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  historialesCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private usuariosService: UsuarioService, private turnosService: TurnosService) {
    this.historialesCollection = collection(this.firestore, 'historiales');
  }

  nuevoHistorial(historial: Historial) {
    return addDoc(this.historialesCollection, {
      altura: historial.altura,
      peso: historial.peso,
      temperatura: historial.temperatura,
      presion: historial.presion,
      turno_uid: historial.turno.uid,
      paciente_uid: historial.turno.paciente.uid,
      especialista: historial.turno.especialista.uid,
      datosExtra: historial.datosExtra
    });
  }

  traerTodos() {
    return collectionData(this.historialesCollection, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => this.armarHistorial(b))
    }));;
  }

  traerMisHistoriales() {
    var usuarioIngresado = this.usuariosService.usuarioIngresado;
    let campo = usuarioIngresado instanceof Paciente ? 'paciente_uid' : 'especialista_uid';

    let q = query(this.historialesCollection, where(campo, "==", usuarioIngresado?.uid));

    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => {
        let historial: Historial = this.armarHistorial(b);
        return historial;
      });
    }));
  }

  traerHistorialesUsuario(usuario: Usuario) {
    let campo = usuario.tipoUsuario == 'paciente' ? 'paciente_uid' : 'especialista_uid';

    let q = query(this.historialesCollection, where(campo, "==", usuario?.uid));

    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => {
        let historial: Historial = this.armarHistorial(b);
        return historial;
      });
    }));
  }

  armarHistorial(data: any) {
    {
      var historial = new Historial(data['uid'], data['altura'], data['peso'], data['temperatura'], data['presion']);
      historial.datosExtra = data['datosExtra'];
      this.turnosService.traerTurno(data['turno_uid']).then(b => {
        historial.turno = b;
      });
      console.log(historial);
      return historial;
    }
  }
}
