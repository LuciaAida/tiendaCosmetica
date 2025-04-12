import { Component } from '@angular/core';
import { AuthService } from '../../../../service/aut-service.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent {
  esAdmin: boolean = false;

  constructor(
    private authService: AuthService
  ){}

  ngOnInit():void{
    this.authService.esAdmin$.subscribe(isAdmin => {
      this.esAdmin = isAdmin;
    });
  }
}
