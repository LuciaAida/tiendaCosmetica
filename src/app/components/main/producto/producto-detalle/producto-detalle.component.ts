import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../service/aut-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from '../../../../service/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { productoModelo } from '../modelo/producto.modelo';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent implements OnInit{
  esAdmin: boolean = false;
  producto!: productoModelo;
  formProducto!: FormGroup;
  isEditing: boolean = false;
  mostrarModal: boolean = false;
  modalMensaje: string = '¿Estás seguro de guardar los cambios?';

  constructor(
    private authService: AuthService,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.esAdmin$.subscribe(isAdmin => {
      this.esAdmin = isAdmin;
    });

    const productoId = this.route.snapshot.paramMap.get('id');
    if (productoId) {
      this.productoService.obtenerProductoPorId(productoId).subscribe(producto => {
        if (producto) {
          this.producto = producto;
          this.formProducto = this.fb.group({
            nombre: [producto.nombre],
            precio: [producto.precio],
            tipo: [producto.tipo],
            descripcion: [producto.descripcion]
          });
        } else {
          console.warn('Producto no encontrado');
        }
      });
    }
  }

  habilitarEdicion(): void {
    this.isEditing = true;
  }

  enviar(): void {
    if (this.isEditing) {
      this.mostrarModal = true;
    }
  }

  cerrarModal(): void {
    if (this.producto && this.formProducto.valid) {
      const datosActualizados = {
        id: this.producto.id,
        nombre: this.formProducto.value.nombre,
        tipo: this.producto.tipo,          
        subtipo: this.producto.subtipo,    
        urlImagen: this.producto.urlImagen, 
        descripcion: this.formProducto.value.descripcion,
        precio: this.formProducto.value.precio
      };
      if (!this.producto?.id) {
        console.error('No se puede actualizar: el producto no tiene ID');
        return;
      }

      this.productoService.actualizarProducto(this.producto.id, datosActualizados);
    }

    this.mostrarModal = false;
    this.router.navigate(['/productos/lista']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
