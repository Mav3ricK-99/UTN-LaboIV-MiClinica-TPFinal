import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, or, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where, and } from '@angular/fire/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { map } from 'rxjs';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';
import { beforeAuthStateChanged } from '@angular/fire/auth';
import { getStorage, ref, uploadBytes } from "firebase/storage";

@Injectable()

export class UsuarioService {

  usuariosCollection: CollectionReference<DocumentData>;

  public usuarioIngresado: Usuario | undefined;

  constructor(private firestore: Firestore, private afAuth: AngularFireAuth, private router: Router) {
    this.usuariosCollection = collection(this.firestore, 'usuarios');

    const auth = getAuth();
    beforeAuthStateChanged(auth, (user) => {
      const lastSignIn = user?.metadata.lastSignInTime;
      let lastSignInMil = 0;
      if (lastSignIn) {
        lastSignInMil = Date.parse(lastSignIn) - (10800 * 100);
      }
      const horaActualMil = new Date();

      let diferenciaEnSegundos = (Math.floor(lastSignInMil / 1000) - Math.floor(horaActualMil.getTime() / 1000)) / 60;
      const entroPorUltimaVezHace5Minutos = (diferenciaEnSegundos < 300 && diferenciaEnSegundos >= 0) || (diferenciaEnSegundos > -300 && diferenciaEnSegundos <= 0) //Si entro por ultima vez en los ultimos 5 minutos

      if (user && user.emailVerified !== true && !entroPorUltimaVezHace5Minutos) {
        throw {
          code: "auth/login-blocked",
          error: new Error()
        };
      }
    });

    this.getUsuarioDeLocalStorage();

    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.traerUsuario(user.uid).then(doc => {
          if (doc.exists()) {
            let data = doc.data();
            data['email'] = user?.email;
            data['uid'] = user?.uid;
            if (data['tipoUsuario'] == 'especialista') {
              this.usuarioIngresado = this.armarEspecialista(data);
            } else if (data['tipoUsuario'] == 'paciente') {
              this.usuarioIngresado = this.armarPaciente(data);
            } else {
              this.usuarioIngresado = this.armarUsuario(data);
            }
            localStorage.setItem('currentUser', JSON.stringify(this.usuarioIngresado));
          }
        });
      } else {
        localStorage.removeItem('currentUser');
        this.router.navigateByUrl('/');
      }
    });
  }

  traerTodos() {
    return collectionData(this.usuariosCollection, { idField: 'uid' });
  }
  //console.log(this.afAuth.user.subscribe((e) => console.log(e))) Otra forma de obtener el logeado
  async traerUsuario(id: string) {
    const documento = doc(this.firestore, `usuarios/${id}`);
    return await getDoc(documento);
  }

  habilitarCuenta(uid: string, habilitar: boolean) {
    return updateDoc(doc(this.firestore, `usuarios/${uid}`), {
      cuentaHabilitada: habilitar,
    });
  }

  crearPaciente(paciente: Paciente, id: string) {
    return setDoc(doc(this.usuariosCollection, id), {
      email: paciente.email,
      nombre: paciente.nombre,
      edad: paciente.edad,
      dni: paciente.dni,
      obraSocial: paciente.obraSocial,
      nroAfiliado: paciente.nroAfiliado,
      tipoUsuario: paciente.tipoUsuario,
      cuentaHabilitada: paciente.cuentaHabilitada
    });
  }

  crearEspecialista(especialista: Especialista, id: string) {

    return setDoc(doc(this.usuariosCollection, id), {
      email: especialista.email,
      nombre: especialista.nombre,
      edad: especialista.edad,
      dni: especialista.dni,
      especialidad: especialista.especialidad,
      nroMatricula: especialista.nroMatricula,
      tipoUsuario: especialista.tipoUsuario,
      cuentaHabilitada: especialista.cuentaHabilitada
    });
  }

  crearUsuario(usuario: Usuario, id: string) {

    return setDoc(doc(this.usuariosCollection, id), {
      email: usuario.email,
      nombre: usuario.nombre,
      edad: usuario.edad,
      dni: usuario.dni,
      tipoUsuario: usuario.tipoUsuario,
      cuentaHabilitada: true
    });
  }

  registrarUsuario(nuevoUsuario: Usuario, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(nuevoUsuario.email, password).then((res) => {
      if (res.user) {
        if (nuevoUsuario instanceof Paciente) {
          this.crearPaciente(nuevoUsuario, res.user.uid)
        } else if (nuevoUsuario instanceof Especialista) {
          this.crearEspecialista(nuevoUsuario, res.user.uid);
        } else {
          this.crearUsuario(nuevoUsuario, res.user.uid)
        }
        res.user.sendEmailVerification();
      }
      return res;
    })
  }

  async ingresarUsuario(email: string, password: string) {
    const auth = getAuth();

    await signInWithEmailAndPassword(auth, email, password);
  }

  async cerrarSesionUsuario() {
    signOut(getAuth()).then(() => {
      this.usuarioIngresado = undefined;
    });
  }

  armarUsuario(data: any): Usuario {
    let usuario = new Usuario(data['uid'], data['nombre'], data['edad'], data['dni'], data['email'], data['cuentaHabilitada'], data['pathImagen']);
    if (data['tipoUsuario'] == 'admin') {
      usuario.tipoUsuario = 'admin';
    }

    return usuario;
  }

  armarPaciente(data: any): Paciente {
    let paciente = new Paciente(data['uid'], data['nombre'], data['edad'], data['dni'], data['email'], data['cuentaHabilitada'], data['pathImagen'], data['obraSocial'], data['nroAfiliado']);
    paciente.tipoUsuario = data['tipoUsuario'];

    return paciente;
  }

  armarEspecialista(data: any): Especialista {
    let especialista = new Especialista(data['uid'], data['nombre'], data['edad'], data['dni'], data['email'], data['cuentaHabilitada'], data['pathImagen'], data['especialidad'], data['nroMatricula']);
    especialista.tipoUsuario = data['tipoUsuario'];

    return especialista;
  }

  getUsuarioDeLocalStorage() {
    let usuarioIngresadoLocalStrg = localStorage.getItem('currentUser');
    if (usuarioIngresadoLocalStrg != undefined) {
      let usuario = JSON.parse(usuarioIngresadoLocalStrg);
      if (usuario.tipoUsuario == 'especialista') {
        this.usuarioIngresado = this.armarEspecialista(usuario);
      } else if (usuario.tipoUsuario == 'paciente') {
        this.usuarioIngresado = this.armarPaciente(usuario);
      } else {
        this.usuarioIngresado = this.armarUsuario(usuario);
      }
    }
  }

  hayUsuarioIngresado(): boolean {
    return this.usuarioIngresado != null;
  }

  actualizarPathImagenPerfil(uid: string, fullPath: string) {
    console.log(fullPath);
    const documento = doc(this.firestore, `usuarios`, uid);
    return updateDoc(documento, {
      pathImagen: fullPath
    });
  }

  subirFotoUsuario(uid: string, foto: File) {
    let fechaHoy = new Date().toJSON();
    const filePath = `usuarios/perfiles/${fechaHoy}_${foto.name}`;
    const storage = getStorage();
    const storageRef = ref(storage, filePath);

    return uploadBytes(storageRef, foto).then((snapshot) => {
      this.actualizarPathImagenPerfil(uid, snapshot.metadata.fullPath)
    });
  }

  buscarUsuario(nombreUsuario: string, tipoUsuario?: string) {
    let q;
    if (tipoUsuario) {
      q = query(this.usuariosCollection, and(
        /* where("tipoUsuario", "==", tipoUsuario) ,*/
        or(
          where("nombre", ">=", nombreUsuario),
          where("nombre", "<=", nombreUsuario + '\uf8ff')
        )
      ));
    } else {
      q = query(this.usuariosCollection, or(
        where("nombre", ">=", nombreUsuario),
        where("nombre", "<=", nombreUsuario + '\uf8ff'))
      );
    }

    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => {
        let usuario: Usuario;
        switch (tipoUsuario) {
          case 'paciente': usuario = this.armarPaciente(b); break;
          case 'especialista': usuario = this.armarEspecialista(b); break;
          default: usuario = this.armarUsuario(b); break;
        }
        return usuario;
      });
    }));
  }

  buscarEspecialistaPorEspecialidad(especialidad: string, nombreUsuario?: string) {
    let q;

    if (nombreUsuario) {
      q = query(this.usuariosCollection, and(
        where("cuentaHabilitada", "==", true),
        where("especialidad", "==", especialidad),
        where("tipoUsuario", "==", 'especialista'),
        or(
          where("nombre", ">=", nombreUsuario),
          where("nombre", "<=", nombreUsuario + "\uf8ff")
        )
      ));
    } else {
      q = query(this.usuariosCollection, and(
        where("cuentaHabilitada", "==", true),
        where("especialidad", "==", especialidad),
        where("tipoUsuario", "==", 'especialista'),
      ));
    }

    console.log(q);
    return collectionData(q, { idField: 'uid' }).pipe(map(collection => {
      return collection.map(b => {
        let usuario: Usuario = this.armarEspecialista(b);
        return usuario;
      });
    }));
  }


}
