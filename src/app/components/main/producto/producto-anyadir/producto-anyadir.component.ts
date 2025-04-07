import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { getDownloadURL, getStorage, provideStorage, ref, Storage, uploadBytes } from '@angular/fire/storage';
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
    { id: 'piel', nombre: 'Piel' },
    { id: 'peloRizado', nombre: 'Pelo Rizado' }
  ]

  subtipos = [
    { id: '1', nombre: 'Piel grasa', tipoId: 'piel' },
    { id: '2', nombre: 'Piel seca', tipoId: 'piel' },
    { id: '3', nombre: 'Piel mixta', tipoId: 'piel' },
    { id: '4', nombre: 'Piel sensible', tipoId: 'piel' },

    { id: '5', nombre: 'Champú de Pelo', tipoId: 'pelo' },
    { id: '6', nombre: 'Acondicionador de Pelo', tipoId: 'pelo' },
    { id: '7', nombre: 'Mascarilla de Pelo', tipoId: 'pelo' },

    { id: '8', nombre: 'Champú de Pelo Rizado', tipoId: 'peloRizado' },
    { id: '9', nombre: 'Acondicionador de Pelo Rizado', tipoId: 'peloRizado' },
    { id: '10', nombre: 'Mascarilla de Pelo Rizado', tipoId: 'peloRizado' },
    { id: '11', nombre: 'Activador de rizos', tipoId: 'peloRizado' }
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
    return subtipos[0].id;
  }


  onTipoChange(): void {
    const tipoSeleccionado = this.form.get('tipo')?.value; //tipo seleccionado del form
    if (tipoSeleccionado) {
      this.subtiposFiltrados = this.subtipos.filter(subtipo => subtipo.tipoId === tipoSeleccionado);
    } else {
      this.subtiposFiltrados = this.subtipos; // Muestra todos los subtipos si no se ha seleccionado un tipo
    }
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
