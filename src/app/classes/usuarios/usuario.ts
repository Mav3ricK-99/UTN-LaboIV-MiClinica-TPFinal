export class Usuario {

    public uid: string;
    public nombre: string;
    public edad: number;
    public dni: number;
    public email: string;

    public cuentaHabilitada: boolean;
    public tipoUsuario: string;

    constructor(uid?: string, nombre?: string, edad?: number, dni?: number, email?: string, cuentaHabilitada?: boolean) {
        this.uid = uid ?? "";
        this.nombre = nombre ?? "";
        this.edad = dni ?? 0;
        this.dni = dni ?? 0;
        this.email = email ?? "";
        this.cuentaHabilitada = cuentaHabilitada ?? true;
    }

    isAdmin(): boolean {
        return this.tipoUsuario == 'admin';
    }
}
