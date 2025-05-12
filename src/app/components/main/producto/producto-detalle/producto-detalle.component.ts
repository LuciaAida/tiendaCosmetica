import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../service/aut-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from '../../../../service/producto.service';
import { productoModelo } from '../modelo/producto.modelo';
import { UsuarioService } from '../../../../service/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent implements OnInit {
  esAdmin: boolean = false;
  producto!: productoModelo;
  formProducto!: FormGroup;
  isEditing: boolean = false;
  uid!: string;
  cesta: any[] = [];
  mostrarModal: boolean = false;
  modalMensaje: string = '¿Estás seguro de guardar los cambios?';
  estaAutenticado = false;
  modalMensajeCarrito = '';
  modalTipo: 'confirmLogin' | 'edicion' = 'confirmLogin';

  constructor(
    private authService: AuthService,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private usuService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.uid = this.authService.getUsuarioId()!; 
    this.usuService.cargarDatosUsuario(this.uid);
    this.usuService.cesta$
    .subscribe(items => this.cesta = items); 

    this.authService.esAdmin$.subscribe(isAdmin => {
      this.esAdmin = isAdmin;
    });

    this.authService.estaAutenticado.subscribe(valor => {
      this.estaAutenticado = valor;
    })

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

  // Cambiar el tipo de modal dependiendo de la acción
  enviar(): void {
    if (this.isEditing) {
      this.modalTipo = 'edicion';  // Mostrar el modal de confirmación de edición
      this.mostrarModal = true;
    }
  }

  cerrarModal(confirm = false): void {
    this.mostrarModal = false;

    // Comportamiento según el tipo de modal
    if (this.modalTipo === 'edicion' && confirm) {
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

        this.productoService.actualizarProducto(this.producto.id!, datosActualizados);
        this.router.navigate(['/productos/lista']);
      }
    }

    // Si el tipo de modal es confirmLogin
    if (this.modalTipo === 'confirmLogin' && confirm) {
      this.router.navigate(['/crearCuenta']);
    }
  }


  cancelarEdicion(): void {
    this.isEditing = false;
    this.formProducto.patchValue({
      nombre: this.producto.nombre,
      precio: this.producto.precio,
      descripcion: this.producto.descripcion
    });
  }

  anyadirACesta(producto: any) {
    if (!this.estaAutenticado) {
      this.modalTipo = 'confirmLogin';
      this.modalMensajeCarrito = 'Por favor, inicia sesión para continuar con tu compra';
      this.mostrarModal = true;
      return;
    }

    const idx = this.cesta.findIndex(p => p.id === producto.id);
    if (idx !== -1){
      this.cesta[idx].cantidad++;
    } 
    else{
      this.cesta.push({ ...producto, cantidad: 1 });
    } 
    // this.usuService.guardarCesta(this.uid, this.cesta);
    // this.router.navigate(['cestaComp']);
    this.usuService.guardarCesta(this.uid, this.cesta);
    localStorage.setItem('cesta', JSON.stringify(this.cesta)); // Sincroniza localStorage
    this.router.navigate(['cestaComp']);
  }


  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}

