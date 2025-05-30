import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../service/usuario.service';
import { AuthService } from '../../../../service/aut-service.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cesta-compra',
  templateUrl: './cesta-compra.component.html',
  styleUrls: ['./cesta-compra.component.css'],
  providers: [CurrencyPipe],
  imports: [CommonModule]
})
export class CestaCompraComponent implements OnInit {
  cesta: any[] = [];
  uid!: string;
  mostrarModal: boolean = false;
  modalMensaje: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.uid = user.uid;
      
        // Obtener cesta desde Firestore
        this.usuarioService.getCesta(this.uid).subscribe(cesta => {
          this.cesta = cesta;
          localStorage.setItem('cesta', JSON.stringify(cesta)); 
        });
      }
    });
  }
  
  añadirACesta(producto: any) {
    const idx = this.cesta.findIndex(p => p.id === producto.id);
    if (idx !== -1) {
      this.cesta[idx].cantidad++;
    } else {
      this.cesta.push({ ...producto, cantidad: 1 });
    }
    this.usuarioService.guardarCesta(this.uid, this.cesta);
  }

  sumarCantidad(producto: any) {
    producto.cantidad++;
    this.usuarioService.guardarCesta(this.uid, this.cesta);
  }

  restarCantidad(producto: any) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
      this.usuarioService.guardarCesta(this.uid, this.cesta);
    }
  }

  eliminarProducto(producto: any) {
    this.cesta = this.cesta.filter(p => p.id !== producto.id);
    this.usuarioService.guardarCesta(this.uid, this.cesta);
  }

  calcularTotal(): number {
    return this.cesta.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  hacerCompra() {
    this.cesta = [];
    this.usuarioService.guardarCesta(this.uid!, []);
    this.modalMensaje = 'Su compra se ha realizado con éxito';
    this.mostrarModal = true;
  }
  
  cerrarModal() {
    this.mostrarModal = false; 
  }
  

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
