import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/aut-service.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  private authSubscription!: Subscription;
  private nombreUsuarioSubscription!: Subscription;
  estaAutenticado: boolean = false;
  nombreUsuario: string = '';

  constructor(
    private router:Router,
    private authService: AuthService
  ){}
  
  ngOnInit():void{
    this.authSubscription = this.authService.estaAutenticado.subscribe(authStatus => {
      this.estaAutenticado = authStatus;
    });
    this.nombreUsuarioSubscription = this.authService.nombreUsuario$.subscribe(nombre => {
      this.nombreUsuario = nombre;
    });
  }

  navigateTo(route:string){
    this.router.navigate([route]);
  }

   cerrarSesion(){
     this.authService.logout();
     this.router.navigate(['/login']);
   }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if(this.nombreUsuarioSubscription){
      this.nombreUsuarioSubscription.unsubscribe();
    }
  }
}
