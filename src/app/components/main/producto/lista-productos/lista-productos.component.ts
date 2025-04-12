import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { productoModelo } from '../modelo/producto.modelo';
import { ProductoService } from '../../../../service/producto.service';
import { AuthService } from '../../../../service/aut-service.service';

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
  esAdmin: boolean = false;

  constructor(
    private ProductoService: ProductoService, 
    private router:Router,
    private authService: AuthService
  ){}

  ngOnInit():void{
    this.authService.esAdmin$.subscribe(isAdmin => {
      this.esAdmin = isAdmin;
    });
    this.ProductoService.getProductos().subscribe(
      (data: productoModelo[]) => {
        this.productos = data;
      },
      (error:any) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  acortarDescripcion(description: string, esImagenGrande: boolean, limitPequeno: number = 15, limitGrande: number = 50, minimoLineas: number = 2): string {
    // Determina el límite de caracteres basado en si la imagen es grande o pequeña
    const limit = esImagenGrande ? limitPequeno : limitGrande; 
    
    // Calcula la longitud mínima en base al número de líneas que quieres
    const longitudMinima = minimoLineas * 30;  // 30 caracteres como un estimado por línea

    // Usa el límite más grande entre el límite calculado y el mínimo requerido
    const limiteFinal = Math.max(limit, longitudMinima);

    // Devuelve la descripción cortada si es necesario, añadiendo '...' al final
    return description.length > limiteFinal ? description.substring(0, limiteFinal) + '...' : description;
}
  
  navigateTo(route:string){
    this.router.navigate([route]);
  }

  eliminarProducto(id: string, index: number) {
    this.ProductoService.eliminarProducto(id)
      .then(() => {
        this.productos.splice(index, 1);
        this.modalMensaje = 'Producto eliminado correctamente';
        this.mostrarModal = true;
      })
      .catch((error) => {
        this.modalMensaje = 'Error al eliminar el producto';
        this.mostrarModal = true;
      });
  }

  cerrarModal(){
    this.mostrarModal = false;
  }

}
