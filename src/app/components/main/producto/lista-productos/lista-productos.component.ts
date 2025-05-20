import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { productoModelo } from '../modelo/producto.modelo';
import { ProductoService } from '../../../../service/producto.service';
import { AuthService } from '../../../../service/aut-service.service';
import { Filtro, FiltroService } from '../../../../service/filtro.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent implements OnInit{
  productos: productoModelo[]=[];
  producto: any;
  editingIndex: number | null = null;
  dialog: any;
  mostrarModal: boolean = false;
  modalMensaje: string = '';
  filtrados: productoModelo[] = [];
  esAdmin: boolean = false;

  constructor(
    private ProductoService: ProductoService, 
    private router:Router,
    private authService: AuthService,
    private filtroService: FiltroService
  ){}

  ngOnInit():void{
    this.authService.esAdmin$.subscribe(isAdmin => {
      this.esAdmin = isAdmin;
    });
    this.ProductoService.getProductos().subscribe(all => {
      this.productos = all;
      this.filtrados = all;              
    });

    this.filtroService.filtro$.subscribe((f: Filtro) => {
      this.aplicarFiltro(f);
    });
  }

  aplicarFiltro(f: Filtro) {
    const { tipo, subtipo } = f;
    if (!tipo) {
      this.filtrados = this.productos;
    } else {
      this.filtrados = this.productos.filter(p =>
        p.tipo === tipo && (subtipo ? p.subtipo === subtipo : true)
      );
    }
  }

  acortarDescripcion(description: string, esImagenGrande: boolean, limitPequeno: number = 15, limitGrande: number = 50, minimoLineas: number = 2): string {
    // determina el limite de carasteres 
    const limit = esImagenGrande ? limitPequeno : limitGrande; 
    
    // calculo longitud mínima en base al numero de lineas(30 defecto)
    const longitudMinima = minimoLineas * 30;

    // limite más grande entre el calculado y el minimo
    const limiteFinal = Math.max(limit, longitudMinima);
    return description.length > limiteFinal ? description.substring(0, limiteFinal) + '...' : description;
}
  
  navigateTo(route:string, id?:string){
    if (id) {
      this.router.navigate([route, id]);
    } else {
      this.router.navigate([route]);
    }
  }

  eliminarProducto(id: string, index: number) {
    this.ProductoService.eliminarProducto(id)
      .then(() => {
        this.productos = this.productos.filter(p => p.id !== id); //eliminar del array original
        this.filtrados = this.filtrados.filter(p => p.id !== id); //eliminar del array filtrados
        this.modalMensaje = 'Producto eliminado correctamente';
        this.mostrarModal = true;
      })
      .catch(() => {
        this.modalMensaje = 'Error al eliminar el producto';
        this.mostrarModal = true;
      });
  }
  

  cerrarModal(){
    this.mostrarModal = false;
  }

}
