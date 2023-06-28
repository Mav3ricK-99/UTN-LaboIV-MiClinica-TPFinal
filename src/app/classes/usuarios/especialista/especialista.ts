import { EstadosTurnos, Turno } from "../../turno/turno";
import { Usuario } from "../usuario";

export class Especialista extends Usuario {

    public especialidad: string[];
    public nroMatricula: number;

    public turnos: Turno[] = [];

    constructor(uid?: string, nombre?: string, edad?: number, dni?: number, email?: string, cuentaHabilitada?: boolean, especialidad?: string[], nroMatricula?: number) {
        super(uid, nombre, dni, edad, email, cuentaHabilitada);

        this.especialidad = especialidad ?? [];
        this.nroMatricula = nroMatricula ?? 0;

        this.tipoUsuario = 'especialista';
        this.cuentaHabilitada = true;
    }

    agregarTurno(turno: Turno) {
        this.turnos.push(turno);
    }

    disponibilidadesProximas(): Date[] {
        if (!this.turnos) return [];

        var fechaProximoTurnoMili = Date.now();
        var fechaProximoTurno: Date = new Date();

        var dates: Date[] = [];

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

            if (fechaProximoTurno.getDay() == 0 || (horaProximoTurno < 8 || horaProximoTurno > 14)) {
                let fechaAlt = new Date(fechaProximoTurnoMili);
                fechaAlt.setHours(8);
                fechaAlt.setMinutes(0);
                fechaProximoTurnoMili = fechaAlt.getTime() + 86400000; //Salto el domingo. DEJAR ASI!

                agregarMinutos = false;

                continue;
            } else {
                agregarMinutos = true;
            }
            if (this.disponibleEnFecha(fechaProximoTurno)) {
                dates.push(fechaProximoTurno)
            }

        } while (intento <= 20);
        return dates;
    }

    disponibleEnFecha(fecha: Date): boolean {
        if (!this.turnos.length) return true;
        var disponibleEnFecha = true;
        this.turnos.forEach((turno) => {
            if (turno.estado == EstadosTurnos.aprobado) {
                let fechaTurno = turno.fecha_turno;
                fechaTurno.setSeconds(0);
                let fechaTurnoEn30Minutos = new Date(turno.fecha_turno.getTime() + 30 * 60000); //30 minutos despues

                fecha.setMilliseconds(0);
                fechaTurno.setMilliseconds(0);
                fechaTurnoEn30Minutos.setMilliseconds(0);
                if (fecha >= fechaTurno && fecha < fechaTurnoEn30Minutos) {
                    disponibleEnFecha = false;
                }
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
