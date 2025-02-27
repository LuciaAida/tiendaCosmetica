import { Component } from '@angular/core';

@Component({
  selector: 'app-info-personal',
  standalone: true,
  imports: [],
  templateUrl: './info-personal.component.html',
  styleUrl: './info-personal.component.css'
})
export class InfoPersonalComponent {

    /*funcion para obtener datos
    la funcion de guardar, actualiza los datos
    */

    guardarDatos(){
      console.log("AAAAAA");
    }
}
