export class Usuario {

    public uid: string;
    public nombre: string;
    public edad: number;
    public dni: number;
    public email: string;

    public cuentaHabilitada: boolean;
    public tipoUsuario: string;
    public pathImagen: string;

    constructor(uid?: string, nombre?: string, edad?: number, dni?: number, email?: string, cuentaHabilitada?: boolean) {
        this.uid = uid ?? "";
        this.nombre = nombre ?? "";
        this.edad = edad ?? 0;
        this.dni = dni ?? 0;
        this.email = email ?? "";
        this.cuentaHabilitada = cuentaHabilitada ?? true;
        this.pathImagen = './assets/default_user.png';
    }

    puedeCrearTurnos() {
        return this.isAdmin() || this.tipoUsuario == 'paciente' ? true : false;
    }

    isAdmin(): boolean {
        return this.tipoUsuario == 'admin';
    }
}
