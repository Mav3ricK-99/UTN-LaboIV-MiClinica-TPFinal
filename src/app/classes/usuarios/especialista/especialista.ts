import { Usuario } from "../usuario";

export class Especialista extends Usuario {

    public especialidad: string;
    public nroMatricula: number;

    constructor(uid?: string, nombre?: string, edad?: number, dni?: number, email?: string, cuentaHabilitada?: boolean, pathImagen?: string, especialidad?: string, nroMatricula?: number) {
        super(uid, nombre, dni, edad, email, cuentaHabilitada, pathImagen);

        this.especialidad = especialidad ?? '';
        this.nroMatricula = nroMatricula ?? 0;

        this.tipoUsuario = 'especialista';
        this.cuentaHabilitada = true;
    }
}
