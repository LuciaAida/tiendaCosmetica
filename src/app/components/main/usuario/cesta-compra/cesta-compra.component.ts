import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cesta-compra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cesta-compra.component.html',
  styleUrl: './cesta-compra.component.css'
})
export class CestaCompraComponent implements OnInit {
  cesta: any[] = [];
  mostrarModal: boolean = false;
  modalMensaje: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarCesta();
  }

  private cargarCesta() {
    const datos = localStorage.getItem('cesta');
    this.cesta = datos ? JSON.parse(datos) : [];
  }

  añadirACesta(producto: any) {
    let cesta: any[] = JSON.parse(localStorage.getItem('cesta') || '[]');
  
    const indice = cesta.findIndex(p => p.id === producto.id);
    if (indice !== -1) {
      cesta[indice].cantidad += 1;
    } else {
      cesta.push({ ...producto, cantidad: 1 });
    }
  
    localStorage.setItem('cesta', JSON.stringify(cesta));
  }
  
  sumarCantidad(producto: any) {
    producto.cantidad++;
    this.actualizarStorage();
  }

  restarCantidad(producto: any) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
      this.actualizarStorage();
    }
  }

  eliminarProducto(producto: any) {
    this.cesta = this.cesta.filter(p => p.id !== producto.id);
    this.actualizarStorage();
  }

  calcularTotal(): number {
    return this.cesta.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }  

  actualizarStorage() {
    localStorage.setItem('cesta', JSON.stringify(this.cesta));
    this.cargarCesta();
  }
  
  cerrarModal() {
    this.mostrarModal = false;
    localStorage.removeItem('cesta');
    this.cargarCesta(); 
  }
  
  hacerCompra() {
    this.mostrarModal = true;
    this.modalMensaje = 'Su compra se ha realizado con éxito';
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
