import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../../service/producto.service';

@Component({
  selector: 'app-producto-anyadir',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './producto-anyadir.component.html',
  styleUrl: './producto-anyadir.component.css'
})
export class ProductoAnyadirComponent implements OnInit{
  public form!:FormGroup;

  tipos =[
    {id:'pelo', nombre:'Pelo'},
    {id:'piel', nombre:'Piel'},
    {id:'peloRizado', nombre:'Pelo Rizado'}
  ]

  subtipos = [
    { id: '1', nombre: 'Piel grasa', tipoId:'piel' },
    { id: '2', nombre: 'Piel seca' , tipoId:'piel' },
    { id: '3', nombre: 'Piel mixta', tipoId:'piel'  },
    { id: '4', nombre: 'Piel sensible', tipoId:'piel'  },

    { id: '5', nombre: 'Champú de Pelo', tipoId:'pelo'},
    { id: '6', nombre: 'Acondicionador de Pelo', tipoId:'pelo' },
    { id: '7', nombre: 'Mascarilla de Pelo', tipoId:'pelo' },

    { id: '8', nombre: 'Champú de Pelo Rizado', tipoId:'peloRizado'  },
    { id: '9', nombre: 'Acondicionador de Pelo Rizado', tipoId:'peloRizado'  },
    { id: '10', nombre: 'Mascarilla de Pelo Rizado', tipoId:'peloRizado'  },
    { id: '11', nombre: 'Activador de rizos' , tipoId:'peloRizado' }
  ];
  subtiposFiltrados:{id:string, nombre:string, tipoId:string}[] =[];
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private storage: Storage,
    private productoService: ProductoService
  ){
    this.form = this.formBuilder.group({
      tipo: ['', Validators.required], 
      subtipo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      file: [null,Validators.required]
    });
  }

  ngOnInit(): void {
    this.subtiposFiltrados = this.subtipos;
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
    }else{
      this.selectedFile = null;
      this.form.patchValue({ file: null });
    }
  }
  
  enviar(){
     if(this.form.valid && this.selectedFile){
          const producto = { //crear el objeto con la url de la imagen
            nombre: this.form.value.nombre,
            tipo: this.form.value.tipo,
            subtipo: this.form.value.subtipo,
            descripcion: this.form.value.descripcion,
            precio: this.form.value.precio
          };
          this.productoService.subirProductoCompleto(producto, this.selectedFile)
      .then(() => {
        alert('Producto añadido correctamente');
        this.form.reset();
        this.selectedFile = null; // Limpiar archivo seleccionado
      })
      .catch(error => {
        alert('Error: ' + error.message);
      });
    }else{
      alert('Completa todos los campos y selecciona una imagen');
    }
  }

}

 //   const archivo = this.form.get('file')?.value;
    //   const filePath = `productos/${Date.now()}_${archivo.name}`; //nombre unico para la imagen en firebase
    //   const fileRef = ref(this.storage, filePath);

    //   uploadBytes(fileRef, archivo).then(() => { //subir el archivo
    //     getDownloadURL(fileRef).then((url) => { //obtener la URL de descarga

