import { Timestamp } from "@angular/fire/firestore";
import { Especialista } from "../usuarios/especialista/especialista";
import { Paciente } from "../usuarios/paciente/paciente";
import { Historial } from "../historial/historial";

export class Turno {

    public uid: string;
    public especialidad: string;
    public especialista: Especialista;
    public paciente: Paciente;
    public fecha_turno: Date;
    public detalle: string;
    public estado: string;

    public calificacion: CalificacionTurno;
    public encuesta: EncuestaTurno;
    public mensaje: string;

    public historial: Historial;

    constructor(uid: string, especialidad: string, fecha_turno: Timestamp | Date, detalle?: string, especialista?: Especialista, paciente?: Paciente, estado?: EstadosTurnos) {
        this.uid = uid;
        this.especialidad = especialidad;
        this.especialista = especialista ?? new Especialista();
        this.paciente = paciente ?? new Paciente();
        fecha_turno instanceof Timestamp ? this.fecha_turno = fecha_turno.toDate() : this.fecha_turno = fecha_turno;
        this.detalle = detalle && detalle != '' ? detalle : 'N/A';
        this.estado = estado ?? EstadosTurnos.pendiente;
    }

    finalizado(): boolean {
        let fechaHoy = new Date();
        return this.estado == EstadosTurnos.finalizado || fechaHoy > this.fecha_turno;
    }

    activo(): boolean {
        return this.estado == EstadosTurnos.aprobado || this.estado == EstadosTurnos.pendiente;
    }

    pendiente(): boolean {
        return this.estado == EstadosTurnos.pendiente;
    }

    aprobado(): boolean {
        return this.estado == EstadosTurnos.aprobado;
    }

    existeEncuesta(): boolean {
        return (this.encuesta) ? true : false;
    }

    existeCalificacionTurno(): boolean {
        return (this.calificacion) ? true : false;
    }
}

export enum EstadosTurnos {
    pendiente = 'Pendiente de aprobación',
    aprobado = 'Aprobado',
    rechazado = 'Rechazado',
    cancelado = 'Cancelado',
    finalizado = 'Finalizado'
}

export interface CalificacionTurno {
    mensaje: string,
    puntaje: number
}

export interface EncuestaTurno {
    mensajeInstalaciones: string,
    puntajeInstalaciones: number,
    mensajeRecepcion: string,
    puntajeRecepcion: number
}