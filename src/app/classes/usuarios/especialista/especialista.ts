import { Turno } from "../../turno/turno";
import { Usuario } from "../usuario";

export class Especialista extends Usuario {

    public especialidad: string;
    public nroMatricula: number;

    public turnos: Turno[] = [];

    constructor(uid?: string, nombre?: string, edad?: number, dni?: number, email?: string, cuentaHabilitada?: boolean, pathImagen?: string, especialidad?: string, nroMatricula?: number) {
        super(uid, nombre, dni, edad, email, cuentaHabilitada, pathImagen);

        this.especialidad = especialidad ?? '';
        this.nroMatricula = nroMatricula ?? 0;

        this.tipoUsuario = 'especialista';
        this.cuentaHabilitada = true;
    }

    agregarTurno(turno: Turno) {
        this.turnos.push(turno);
    }

    disponibilidadProxima(): Date | undefined {
        if (!this.turnos) undefined;

        var fechaEncontrada: boolean = false;
        var fechaProximoTurnoMili = Date.now();
        var fechaProximoTurno: Date = new Date();

        let intento = 0;
        var agregarMinutos = true;
        do {
            intento++;
            if (agregarMinutos) {
                fechaProximoTurnoMili = fechaProximoTurnoMili + 1800000;
            }
            var fechaProximoTurno = new Date(fechaProximoTurnoMili);
            fechaProximoTurno.setSeconds(0);
            let horaProximoTurno = fechaProximoTurno.getHours();

            if (fechaProximoTurno.getDay() == 0 || (horaProximoTurno < 8 || horaProximoTurno > 15)) {
                let fechaAlt = new Date(fechaProximoTurnoMili);
                fechaAlt.setHours(8);
                fechaAlt.setMinutes(0);
                if (fechaProximoTurno.getDay() == 0) {
                    fechaProximoTurnoMili = fechaAlt.getTime() + 86400000; //Salto el domingo
                } else {
                    fechaProximoTurnoMili = fechaAlt.getTime()
                }
                agregarMinutos = false;

                continue;
            } else {
                agregarMinutos = true;
            }

            this.turnos.forEach((turno: Turno) => {
                let fechaTurno = turno.fecha_turno;
                let fechaTurnoEn30Minutos = new Date(turno.fecha_turno.getTime() + 30 * 60000); //30 minutos despues
                fechaTurno.setSeconds(0);

                if (!(fechaProximoTurno > fechaTurno && fechaProximoTurno <= fechaTurnoEn30Minutos)) {
                    fechaEncontrada = true;
                }
            });

        } while (fechaEncontrada == false && intento <= 180); //15 dias Maximo

        return fechaEncontrada ? fechaProximoTurno : undefined;
    }

    disponibleEnFecha(fecha: Date): boolean {
        var disponibleEnFecha = true;
        this.turnos.forEach((turno) => {
            let fechaTurno = turno.fecha_turno;
            fechaTurno.setSeconds(0);
            let fechaTurnoEn30Minutos = new Date(turno.fecha_turno.getTime() + 30 * 60000); //30 minutos despues

            fecha.setMilliseconds(0);
            fechaTurno.setMilliseconds(0);
            fechaTurnoEn30Minutos.setMilliseconds(0);
            if (fecha >= fechaTurno && fecha < fechaTurnoEn30Minutos) {
                disponibleEnFecha = false;
            }
        })
        return disponibleEnFecha;
    }
}

export enum Especialidades {
    otorrinolaringologia = 'Otorrinolaringologia',
    pediatria = 'Pediatría',
    oncologia = 'Oncologia',
    odontologia = 'Odontologia',
    cardiologia = 'Cardiologia',
    neurologia = 'Neurologia',
    psicologia = 'Psicologia',
    psiquiatria = 'Psiquiatria',
    traumatologia = 'Traumatologia',
    urologia = 'Urologia',
    rehabilitacion = 'Rehabilitacion',
    neumologia = 'Neumologia',
    enfermeria = 'Guardia clinica',
    podologia = 'Podologia'
}
