import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cesta-compra',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './cesta-compra.component.html',
  styleUrl: './cesta-compra.component.css'
})
export class CestaCompraComponent implements OnInit {
  cesta: any[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarCesta();
  }

  private cargarCesta() {
    const datos = localStorage.getItem('cesta');
    this.cesta = datos ? JSON.parse(datos) : [];
    console.log('Cesta cargada:', this.cesta); 
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

  actualizarStorage() {
    localStorage.setItem('cesta', JSON.stringify(this.cesta));
    this.cargarCesta(); 
  }

  hacerCompra() {
    alert("¡Compra realizada!");
    this.cesta = [];
    localStorage.removeItem('cesta');
  }


  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
