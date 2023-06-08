import { Usuario } from "../usuario";

export class Paciente extends Usuario {

    public obraSocial: string;
    public nroAfiliado: number;

    constructor(uid?: string, nombre?: string, edad?: number, dni?: number, email?: string, obraSocial?: string, nroAfiliado?: number) {
        super(uid, nombre, dni, edad, email);

        this.obraSocial = obraSocial ?? '';
        this.nroAfiliado = nroAfiliado ?? 0;

        this.tipoUsuario = 'paciente';
    }
}
