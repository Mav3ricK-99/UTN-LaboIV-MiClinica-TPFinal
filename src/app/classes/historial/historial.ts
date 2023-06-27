export class Historial {

    public altura: number;
    public peso: number;
    public temperatura: number;
    public presion: string;
    public datosExtra: Map<String, String>;

    constructor(altura: number, peso: number, temperatura: number, presion: string) {
        this.altura = altura;
        this.peso = peso;
        this.temperatura = temperatura;
        this.presion = presion;
    }
}
