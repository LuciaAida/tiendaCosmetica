import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-contacto',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './form-contacto.component.html',
  styleUrl: './form-contacto.component.css'
})
export class FormContactoComponent implements OnInit{
  public form!: FormGroup;
  mostrarModal: boolean = false;
  mostrarModalError: boolean = false;
  modalMensaje: string = '';
  modalMensajeError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router:Router
  ){}

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  cerrarModal(){
    this.mostrarModal = false;
    this.mostrarModalError = false;
  }
  

  enviar(): void {
    if (this.form.valid) {
      this.modalMensaje = 'Tu mensaje fue enviado con éxito';
      this.mostrarModal = true;
    
    } else {
      this.modalMensajeError = 'Por favor, completa todos los campos correctamente';
      this.mostrarModalError = true;
    }
  }
  

  navigateTo(route:string){
    this.router.navigate([route]);
  }
}
