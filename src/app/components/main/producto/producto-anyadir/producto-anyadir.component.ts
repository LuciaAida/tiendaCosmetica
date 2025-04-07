import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../../service/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-anyadir',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './producto-anyadir.component.html',
  styleUrl: './producto-anyadir.component.css',
})
export class ProductoAnyadirComponent implements OnInit {
  public form!: FormGroup;
  mostrarModal: boolean = false;
  mostrarModalError: boolean = false;
  modalMensaje: string = '';
  modalMensajeError: string = '';
  subtiposFiltrados: { id: string, nombre: string, tipoId: string }[] = [];
  selectedFile: File | null = null;

  tipos = [
    { id: 'pelo', nombre: 'Pelo' },
    { id: 'cuidadoFacial', nombre: 'Cuidado facial' },
    { id: 'peloRizado', nombre: 'Pelo Rizado' }
  ]

  subtipos = [
    { id: '1', nombre: 'Hidratantes', tipoId: 'cuidadoFacial' },
    { id: '2', nombre: 'Limpiadores', tipoId: 'cuidadoFacial' },
    { id: '3', nombre: 'Mascarillas', tipoId: 'cuidadoFacial' },

    { id: '4', nombre: 'Champú de Pelo', tipoId: 'pelo' },
    { id: '5', nombre: 'Acondicionador de Pelo', tipoId: 'pelo' },
    { id: '6', nombre: 'Mascarilla de Pelo', tipoId: 'pelo' },

    { id: '7', nombre: 'Champú de Pelo Rizado', tipoId: 'peloRizado' },
    { id: '8', nombre: 'Acondicionador de Pelo Rizado', tipoId: 'peloRizado' },
    { id: '9', nombre: 'Mascarilla de Pelo Rizado', tipoId: 'peloRizado' },
    { id: '10', nombre: 'Activador de rizos', tipoId: 'peloRizado' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private storage: Storage,
    private productoService: ProductoService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      tipo: ['', Validators.required],
      subtipo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const tipoInicial = this.tipos[0].id;
    const subtipoInicial = this.getPrimerSubtipo(tipoInicial);

    this.form.patchValue({
      tipo: tipoInicial,
      subtipo: subtipoInicial
    });

    this.subtiposFiltrados = this.subtipos.filter(s => s.tipoId === tipoInicial);
  }

  private getPrimerSubtipo(tipoId: string): string {
    const subtipos = this.subtipos.filter(subtipo => subtipo.tipoId === tipoId); //coincide tipoid con id del tipo producto
    return subtipos.length > 0 ? subtipos[0].id : ''; //comprueba si subtipos tiene elementos
  }


  onTipoChange(): void {
    const tipoSeleccionado = this.form.get('tipo')?.value;
    this.subtiposFiltrados = this.subtipos.filter(subtipo => subtipo.tipoId === tipoSeleccionado);
    this.form.patchValue({ //actualiza los subtipos dependiendo del tipo
      subtipo: this.getPrimerSubtipo(tipoSeleccionado)
    });
  }
  

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.form.patchValue({
        file: file
      });
      this.form.get('file')?.updateValueAndValidity();
    } else {
      this.selectedFile = null;
      this.form.patchValue({ file: null });
    }
  }

  enviar() {
    this.form.markAllAsTouched();
  
    if (this.form.valid && this.selectedFile) {
      const producto = {
        nombre: this.form.value.nombre,
        tipo: this.form.value.tipo,
        subtipo: this.form.value.subtipo,
        descripcion: this.form.value.descripcion,
        precio: this.form.value.precio
      };
  
      this.productoService.subirProductoCompleto(producto, this.selectedFile!)
        .then(() => {
          this.modalMensaje = 'Producto añadido correctamente';
          this.mostrarModal = true;
          this.resetFormulario();
        })
        .catch(error => {
          this.modalMensajeError = 'Error: ' + error.message;
          this.mostrarModalError = true;
        });
    } else {
      this.modalMensajeError = 'Por favor, completa todos los campos';
      this.mostrarModalError = true;
    }
  }

  private resetFormulario() {
    this.form.reset();
    this.selectedFile = null;
    this.resetFileInput();
  }
  

  private resetFileInput() {
    const fileInput = document.getElementById('productoImg') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // resetear un input file
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mostrarModalError = false;
  }
}
