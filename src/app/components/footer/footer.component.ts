import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
  constructor(private router:Router){}
  
  ngOnInit():void{
  }

  navigateTo(route:string){
    this.router.navigate([route]);
  }

  enviarCorreo(): void {
    const email = 'luperezaida@gmail.com';
    const subject = encodeURIComponent('Contacto desde mi sitio');
    const body = encodeURIComponent('¡Hola Lucia!\n\nMe gustaría ponerme en contacto sobre...');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

}
