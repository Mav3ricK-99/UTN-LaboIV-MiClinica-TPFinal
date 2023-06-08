import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/classes/usuarios/usuario';
import { Paciente } from 'src/app/classes/usuarios/paciente/paciente';
import { Especialista } from 'src/app/classes/usuarios/especialista/especialista';

@Injectable()

export class UsuarioService {

  usuariosCollection: CollectionReference<DocumentData>;

  public usuarioIngresado: Usuario | undefined;

  constructor(private firestore: Firestore, private afAuth: AngularFireAuth, private router: Router) {
    this.usuariosCollection = collection(this.firestore, 'usuarios');

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
  /*
    
    ESTO NO VA. VA EN UN SERVICE SEPARADO POR EL TIPO DE USUARIO
    eliminarUsuario(usuario: Usuario) {
      const documento = doc(this.firestore, `usuarios/${usuario.getId()}`);
      return deleteDoc(documento);
    }
  */
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
      dni: usuario.dni,
      tipoUsuario: usuario.tipoUsuario,
      cuentaHabilitada: true
    });
  }

  async registrarUsuario(nuevoUsuario: Usuario, password: string) {
    let error = '';
    await this.afAuth.createUserWithEmailAndPassword(nuevoUsuario.email, password).then((res) => {
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
    }).catch(e => {
      error = e;
    })

    if (error) {
      return { error: error }
    } else {
      return nuevoUsuario;
    }
  }

  async ingresarUsuario(email: string, password: string) {
    const auth = getAuth();
    let errorResponse: string = "";

    await signInWithEmailAndPassword(auth, email, password).then((res) => {
      if (res.user.emailVerified !== true) {
        throw {
          code: "auth/unverified-email",
          error: new Error()
        };
      }
    }).catch((error) => {
      errorResponse = error.code;
    })

    return {
      error: errorResponse
    }
  }

  async cerrarSesionUsuario() {
    signOut(getAuth()).then(() => {
      this.usuarioIngresado = undefined;
    });
  }

  armarUsuario(data: any): Usuario {
    let usuario = new Usuario(data['uid'], data['nombre'], data['edad'], data['dni'], data['email']);
    if (data['tipoUsuario'] == 'admin') {
      usuario.tipoUsuario = 'admin';
    }
    /* usuario.setFechaRegistro(data['creationTime']);
    usuario.setFechaRegistro(data['lastLogin']); */
    //usuario.setRole(data['role'] ?? 'empleado');

    return usuario;
  }

  armarPaciente(data: any): Paciente {
    let paciente = new Paciente(data['uid'], data['nombre'], data['edad'], data['dni'], data['email'], data['obraSocial'], data['nroAfiliado']);
    paciente.tipoUsuario = data['tipoUsuario'];
    /* usuario.setFechaRegistro(data['creationTime']);
    usuario.setFechaRegistro(data['lastLogin']); */
    //usuario.setRole(data['role'] ?? 'empleado');

    return paciente;
  }

  armarEspecialista(data: any): Especialista {
    let especialista = new Especialista(data['uid'], data['nombre'], data['edad'], data['dni'], data['email'], data['especialidad'], data['nroMatricula']);
    especialista.tipoUsuario = data['tipoUsuario'];
    /* usuario.setFechaRegistro(data['creationTime']);
    usuario.setFechaRegistro(data['lastLogin']); */
    //usuario.setRole(data['role'] ?? 'empleado');

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
}
