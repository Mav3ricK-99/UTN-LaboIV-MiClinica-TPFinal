import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  animations: [
    trigger('imagenOculta', [
      state('mostrar',
        style({ opacity: 1, marginLeft: '0px' })
      ),
      state('oculta',
        style({ opacity: 0.2, marginLeft: '-120px' })
      ),
      transition('oculta => mostrar', [
        animate('0.75s 0s ease')
      ]),
    ])
  ]
})

export class HomeComponent implements OnInit {

  ocultarImagen: boolean;

  constructor() {
    this.ocultarImagen = true;
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.ocultarImagen = false;
    }, 1000);
  }
}
