import { Turno } from "../turno/turno";

export class Historial {

    public uid: string;
    public turno: Turno;
    public altura: number;
    public peso: number;
    public temperatura: number;
    public presion: string;
    public datosExtra: Map<String, String>;

    constructor(uid: string, altura: number, peso: number, temperatura: number, presion: string) {
        this.uid = uid;
        this.altura = altura;
        this.peso = peso;
        this.temperatura = temperatura;
        this.presion = presion;
    }
}
